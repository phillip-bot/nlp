'use strict';

const firestore = require('./firestore');

const collection = 'Intent';

const upsert = function (obj) {
  return firestore.upsert(collection, obj);
};

const getAll = function () {
  return firestore.getAll(collection);
};

const getById = function ({id}) {
  return firestore.getById(collection, id);
};

module.exports = {collection, upsert, getAll, getById};
