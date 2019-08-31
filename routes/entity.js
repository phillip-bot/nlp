'use strict';

const Router = require('koa-router');

const {Entity} = require('../lib/db');

const getRouter = function () {
  const router = new Router();

  router.get(
    '/entity/:id',
    async function (ctx, next) {
      const entity = await Entity.getById({id: ctx.params.id});

      // eslint-disable-next-line require-atomic-updates
      ctx.entity = entity;
      next();
    },
    function (ctx) {
      const {entity} = ctx;
      ctx.body = {
        id: ctx.params.id,
        name: entity.name,
        examples: entity.examples
      };
    }
  );

  router.post(
    '/entity',
    async function (ctx, next) {
      const {name, examples} = ctx.params;
      const {id} = await Entity.upsert({
        name,
        delimiter: '',
        examples
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
