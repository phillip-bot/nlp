'use strict';

const {Entity, Intent} = require('./lib/db');
const {regexFromExamples} = require('regex-generator');

(async function () {
  try {
    const intents = await Intent.getAll();

    const negativeExamples = new Map();
    intents.forEach(function ({examples}) {
      examplesToMap(examples).forEach(function (_, key) {
        negativeExamples.set(key, '');
      });
    });

    /*
    For (const intent of intents) {
      // Train intents
      const examples = new Map([
        ...negativeExamples,
        ...examplesToMap(intent.examples)
      ]);

      const {regex} = regexFromExamples(examples, {
        guessRegex: true,
        weightedSize: true,
        iterationsThreshold: 10
      });
      console.log(intent.name);
      console.log(regex);

      // eslint-disable-next-line no-await-in-loop
      await Intent.upsert({name: intent.name, regex: regex.source});
    }
    */

    const entities = await Entity.getAll();

    for (const entity of entities) {
      // eslint-disable-next-line no-await-in-loop
      const {name, examples} = entity;

      const examplesMap = examplesToMap(examples);
      const {regex} = regexFromExamples(examplesMap, {
        guessRegex: true,
        weightedSize: true,
        iterationsThreshold: 20
      });

      console.log(name);
      console.log(regex);

      // eslint-disable-next-line no-await-in-loop
      await Entity.upsert({name, regex: regex.source});
    }
  } catch (err) {
    console.error(err);
  }
})();

function examplesToMap(examples) {
  return new Map(Object.entries(examples));
}
