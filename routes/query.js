'use strict';

const Promise = require('bluebird');
const Router = require('koa-router');

const {Entity, Intent} = require('../lib/db');

const getRouter = function () {
  const router = new Router();

  router.post('query', async function (ctx) {
    const {query} = ctx.params;

    const intents = await Intent.getAll();

    const matchedIntents = await Promise.map(intents, intent =>
      matchIntent({query, intent})
    ).filter(intent => intent !== null);

    console.log(matchedIntents);

    ctx.body = matchedIntents;
  });

  return router.routes();
};

async function matchIntent({query, intent}) {
  const {regex} = intent;

  const match = query.match(regex);

  if (!match) {
    return null;
  }

  const entities = await Promise.map(intent.entities, async function (entity) {
    const entityId = entity.id;
    return matchEntity({entityId, query});
  }).filter(entity => entity !== null);

  const confidence = entities.length / intent.entities.length;

  return {
    name: intent.name,
    entities,
    confidence: confidence ? confidence : 0
  };
}

async function matchEntity({entityId, query}) {
  const entity = await Entity.getById({id: entityId});
  const {regex} = entity;

  const match = query.match(regex);

  if (!match) {
    return null;
  }

  const entities = await Promise.map(entity.entities, function (entity) {
    const entityId = entity.id;
    return matchEntity({entityId, query});
  }).filter(entity => entity !== null);

  return {
    name: entity.name,
    entities
  };
}

module.exports = {getRouter};
