'use strict';

const Router = require('koa-router');

const {Intent} = require('../lib/db');

const getRouter = function () {
  const router = new Router();

  router.get(
    '/intent/:id',
    async function (ctx, next) {
      const intent = await Intent.getById({id: ctx.params.id});

      // eslint-disable-next-line require-atomic-updates
      ctx.intent = intent;
      next();
    },
    function (ctx) {
      const {intent} = ctx;
      ctx.body = {
        id: ctx.params.id,
        name: intent.name,
        entities: intent.entities,
        examples: intent.examples
      };
    }
  );

  router.post(
    '/intent',
    async function (ctx, next) {
      const {name, examples, entities} = ctx.params;
      const {id} = await Intent.upsert({
        name,
        examples,
        entities
      });

      // eslint-disable-next-line require-atomic-updates
      ctx.id = id;
      next();
    },
    function (ctx) {
      ctx.body = {id: ctx.id};
    }
  );

  return router.routes();
};

module.exports = {getRouter};
