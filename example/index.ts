import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as R from 'ramda';

import Tupas, { Callbacks as TupasCallbacks } from '../src/index';

const app: Koa = new Koa();

app.use(bodyParser());

const render: Function = (brokers) => {
  return brokers.map((broker) => {

    const res: string = R.values(R.mapObjIndexed((e, i) =>
      `${i} <input type="text" value="${e}" name="${i}">`
    , broker.fields)).join('<br>');

    return `<form action="${broker.url}" method="post">${res}<button type="submit">${broker.name}</button></form>`;
  });
};

app.use(async(ctx) => {
  const stamp: string = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 20);
  const callbacks: TupasCallbacks = {
    success: 'http://localhost:3000/success',
    cancel: 'http://localhost:3000/cancel',
    reject: 'http://localhost:3000/reject'
  };

  // tslint:disable:no-any
  const data: any = Tupas.get(stamp, callbacks);
  const brokers: any = render(data);

  if (Tupas.verify(ctx.query)) {
    ctx.body = `<b>valid!</b><br>${brokers}`;
  } else {
    ctx.body = `<b>authenticate!</b><br>${brokers}`;
  }
});

app.listen(3000);
