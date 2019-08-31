'use strict';

const uuid = require('uuid/v4');
const path = require('path');

const Firestore = require('@google-cloud/firestore');

const db = new Firestore({
  projectId: 'discord-phillip',
  keyFilename: path.join(__dirname, './key.json')
});

const upsert = async function (collectionName, object) {
  if (!object.name) {
    throw new Error('ValidationError: upsert requires a name');
  }

  const collection = db.collection(collectionName);
  const query = await collection.where('name', '==', object.name);
  const snapshot = await query.get();

  let id;
  let doc;

  if (snapshot.empty) {
    id = `${collectionName}-${uuid()}`;
    doc = collection.doc(id);

    await doc.create(object);
  } else if (snapshot.docs.length > 1) {
    throw new Error('Yikes');
  } else {
    console.log(`Update ${collectionName}`);

    const docSnapshot = snapshot.docs[0];
    id = docSnapshot.id;
    doc = collection.doc(id);

    const updated = {
      ...docSnapshot.data(),
      ...object
    };
    console.log(updated);

    await doc.update(updated);
  }

  return {id};
};

const getAll = async function (collectionName) {
  const collection = db.collection(collectionName);
  const snapshot = await collection.get();

  return snapshot.docs.map(function (doc) {
    return doc.data();
  });
};

const getById = async function (collectionName, id) {
  const collection = db.collection(collectionName);
  const snapshot = await collection.doc(id).get();
  return snapshot.data();
};

module.exports = {upsert, getAll, getById};
