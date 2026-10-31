// Pruebas de integración: levantan un MongoDB en memoria, no necesitan base de datos instalada
process.env.NODE_ENV = 'test';

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');

let mongo;
const ids = {};

const nuevaMedia = (extra = {}) => ({
  serial: 'MED-001',
  titulo: 'Interestelar',
  sinopsis: 'Un grupo de exploradores viaja a través de un agujero de gusano.',
  url: 'https://peliculas.iudigital.edu.co/interestelar',
  imagen: 'https://peliculas.iudigital.edu.co/img/interestelar.jpg',
  anioEstreno: 2014,
  genero: ids.genero,
  director: ids.director,
  productora: ids.productora,
  tipo: ids.tipo,
  ...extra,
});

before(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  await Promise.all(Object.values(mongoose.models).map((m) => m.init()));
});

after(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe('Módulos de catálogo', () => {
  it('crea un género con fechas automáticas y estado Activo por defecto', async () => {
    const res = await request(app).post('/api/generos').send({ nombre: 'Ciencia ficción', descripcion: 'Futuro' });
    assert.equal(res.status, 201);
    assert.equal(res.body.estado, 'Activo');
    assert.ok(res.body.fechaCreacion && res.body.fechaActualizacion);
    ids.genero = res.body._id;
  });

  it('rechaza un género duplicado (sin importar mayúsculas)', async () => {
    const res = await request(app).post('/api/generos').send({ nombre: 'CIENCIA FICCIÓN' });
    assert.equal(res.status, 409);
  });

  it('valida campos obligatorios y estado', async () => {
    const sinNombre = await request(app).post('/api/generos').send({ descripcion: 'x' });
    assert.equal(sinNombre.status, 400);
    const estadoMalo = await request(app).post('/api/directores').send({ nombres: 'X', estado: 'Pausado' });
    assert.equal(estadoMalo.status, 400);
  });

  it('crea director, productora y tipo', async () => {
    const director = await request(app).post('/api/directores').send({ nombres: 'Christopher Nolan' });
    const productora = await request(app).post('/api/productoras').send({ nombre: 'Paramount', slogan: 'S', descripcion: 'D' });
    const tipo = await request(app).post('/api/tipos').send({ nombre: 'Película', descripcion: 'Una sola entrega' });
    assert.deepEqual([director.status, productora.status, tipo.status], [201, 201, 201]);
    assert.equal(productora.body.slogan, 'S');
    ids.director = director.body._id;
    ids.productora = productora.body._id;
    ids.tipo = tipo.body._id;
  });

  it('lista, obtiene y actualiza (fechaActualizacion cambia, fechaCreacion no)', async () => {
    const lista = await request(app).get('/api/directores');
    assert.equal(lista.body.length, 1);

    const antes = await request(app).get(`/api/directores/${ids.director}`);
    const res = await request(app).put(`/api/directores/${ids.director}`).send({ nombres: 'Christopher Edward Nolan', fechaCreacion: '2000-01-01' });
    assert.equal(res.status, 200);
    assert.equal(res.body.nombres, 'Christopher Edward Nolan');
    assert.equal(res.body.fechaCreacion, antes.body.fechaCreacion);
    assert.ok(res.body.fechaActualizacion >= antes.body.fechaActualizacion);
  });

  it('filtra por estado', async () => {
    await request(app).post('/api/generos').send({ nombre: 'Terror', estado: 'Inactivo' });
    const activos = await request(app).get('/api/generos?estado=Activo');
    assert.deepEqual(activos.body.map((g) => g.nombre), ['Ciencia ficción']);
    const malo = await request(app).get('/api/generos?estado=otro');
    assert.equal(malo.status, 400);
  });

  it('responde 400 con id inválido y 404 si no existe', async () => {
    assert.equal((await request(app).get('/api/tipos/123')).status, 400);
    assert.equal((await request(app).get(`/api/tipos/${new mongoose.Types.ObjectId()}`)).status, 404);
  });
});

describe('Módulo de Media', () => {
  it('crea una producción y devuelve las referencias pobladas', async () => {
    const res = await request(app).post('/api/medias').send(nuevaMedia());
    assert.equal(res.status, 201, JSON.stringify(res.body));
    assert.equal(res.body.genero.nombre, 'Ciencia ficción');
    assert.equal(res.body.director.nombres, 'Christopher Edward Nolan');
    assert.equal(res.body.tipo.nombre, 'Película');
    ids.media = res.body._id;
  });

  it('serial y URL son únicos', async () => {
    const serial = await request(app).post('/api/medias').send(nuevaMedia({ url: 'https://otra.com/x' }));
    assert.equal(serial.status, 409);
    const url = await request(app).post('/api/medias').send(nuevaMedia({ serial: 'MED-002' }));
    assert.equal(url.status, 409);
  });

  it('solo permite géneros, directores y productoras activos', async () => {
    const inactivo = await request(app).post('/api/directores').send({ nombres: 'Director Inactivo', estado: 'Inactivo' });
    const res = await request(app)
      .post('/api/medias')
      .send(nuevaMedia({ serial: 'MED-003', url: 'https://otra.com/3', director: inactivo.body._id }));
    assert.equal(res.status, 400);
    assert.match(res.body.error, /Inactivo/);
  });

  it('rechaza referencias inexistentes y datos inválidos', async () => {
    const inexistente = await request(app)
      .post('/api/medias')
      .send(nuevaMedia({ serial: 'MED-004', url: 'https://otra.com/4', tipo: new mongoose.Types.ObjectId().toString() }));
    assert.equal(inexistente.status, 400);

    const invalida = await request(app)
      .post('/api/medias')
      .send(nuevaMedia({ serial: 'MED-005', url: 'no-es-url', anioEstreno: 'abc' }));
    assert.equal(invalida.status, 400);
    assert.equal(invalida.body.detalles.length, 2);
  });

  it('filtra por título y género', async () => {
    const porTitulo = await request(app).get('/api/medias?titulo=inter');
    assert.equal(porTitulo.body.length, 1);
    const porGenero = await request(app).get(`/api/medias?genero=${new mongoose.Types.ObjectId()}`);
    assert.equal(porGenero.body.length, 0);
  });

  it('no permite borrar un género en uso, pero sí editar la media si el género se inactiva', async () => {
    const borrar = await request(app).delete(`/api/generos/${ids.genero}`);
    assert.equal(borrar.status, 409);

    await request(app).put(`/api/generos/${ids.genero}`).send({ estado: 'Inactivo' });
    const editar = await request(app).put(`/api/medias/${ids.media}`).send({ titulo: 'Interstellar', genero: ids.genero });
    assert.equal(editar.status, 200);
    assert.equal(editar.body.titulo, 'Interstellar');
  });

  it('elimina la producción y luego el género queda libre para borrarse', async () => {
    assert.equal((await request(app).delete(`/api/medias/${ids.media}`)).status, 200);
    assert.equal((await request(app).get(`/api/medias/${ids.media}`)).status, 404);
    assert.equal((await request(app).delete(`/api/generos/${ids.genero}`)).status, 200);
  });
});
