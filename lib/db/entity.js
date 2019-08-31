'use strict';

const firestore = require('./firestore');

const collection = 'Entity';

const upsert = function (obj) {
  return firestore.upsert(collection, obj);
};

const getById = function ({id}) {
  return firestore.getById(collection, id);
};

const getAll = function () {
  return firestore.getAll(collection);
};

module.exports = {collection, upsert, getById, getAll};
