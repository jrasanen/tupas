import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as R from 'ramda';

import Tupas, { Callbacks as TupasCallbacks } from '../src/index';

const app: Koa = new Koa();

app.use(bodyParser());

const render: Function = (brokers) =>
  brokers.map((broker) => {
    const res: string = R.values(R.mapObjIndexed((e, i) =>
      `<input type="hidden" value="${e}" name="${i}">`, broker.fields)).join('\n');

    return `<form action="${broker.url}" method="post">
              ${res}
              <button type="submit">${broker.name}</button>
            </form>`;
  }).join('');

const html: Function = (content) =>
  `<!DOCTYPE html>
  <html>
  <head>
    <title>TUPAS</title>
  </head>

  <body>
    ${content}
  </body>

  </html>`;

app.use(async(ctx) => {
  const stamp: string = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 20);
  const callbacks: TupasCallbacks = {
    success: 'http://localhost:3000/success',
    cancel: 'http://localhost:3000/cancel',
    reject: 'http://localhost:3000/reject'
  };

  // tslint:disable:no-any
  const data: any = Tupas.generate(stamp, callbacks);
  const brokers: any = render(data);

  if (Tupas.verify(ctx.query)) {
    ctx.body = html(
      `
      <b>valid!</b>
      <br>
      ${brokers}
      `
    );
  } else {
    ctx.body = html(`${brokers}`);
  }
});

app.listen(3000);
