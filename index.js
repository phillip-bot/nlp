'use strict';

const Koa = require('koa');
const app = new Koa();

const entityRouter = require('./routes/entity');
const intentRouter = require('./routes/intent');
const queryRouter = require('./routes/query');

app.use(entityRouter.getRouter());
app.use(intentRouter.getRouter());
app.use(queryRouter.getRouter());

app.listen(3000);
