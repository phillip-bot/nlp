'use strict';

const Promise = require('bluebird');
const moment = require('moment');

const {Entity, Intent} = require('./lib/db');

(async function () {
  const query = '!event games?? 4:00 am mt';

  const intents = await Intent.getAll();

  const matchedIntents = await Promise.map(intents, intent =>
    matchIntent({query, intent})
  ).filter(intent => intent !== null);

  console.log(matchedIntents[0].entities[0]);
  /*
  Try {
    const intents = await Intent.getAll();

    let messageIntent;
    let messageEntities = {};
    let confidence = 0;

    for (const intent of intents) {
      const entities = intent.entities;
      const {regex} = intent;

      const re = new RegExp(regex);

      const matches = message.match(re);

      if (!matches) {
        continue;
      }

      messageIntent = intent.name;
      let matchCount = 0;
      for (const entity of entities) {
        const id = entity.id;
        // eslint-disable-next-line no-await-in-loop
        const {name, regex} = await Entity.getById({id});

        const re = new RegExp(regex);
        console.log(re);

        const matches = message.match(re);

        if (matches) {
          messageEntities[name] = {
            matched: matches[0]
          };
          matchCount++;
        }
      }

      confidence = matchCount / entities.length;
    }

    const result = {
      intent: messageIntent,
      entities: messageEntities,
      confidence
    };

    console.log(result);

    if (result.entities.Time) {
      result.entities.Time.value = moment(
        result.entities.Time.matched.replace(' ', ''),
        ['hh:mma', 'dddhh:mma']
      );
    }
  } catch (err) {
    console.error(err);
  }
    */
})();

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
    return matchEntity({entityId, query: match[0]});
  }).filter(entity => entity !== null);

  return {
    name: entity.name,
    matched: match[0],
    entities
  };
}
