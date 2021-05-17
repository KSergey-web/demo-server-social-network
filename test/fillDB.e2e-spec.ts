import { HttpStatus } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { UserSchema } from '../src/user/schemas/user.schema';

import * as request from 'supertest';
import { identity } from 'rxjs';

const app = `http://localhost:4000/`;
const database = 'mongodb://localhost:27017/nest-write';

let date = new Date();
date.setDate(11);
date.setMonth(2);
date.setFullYear(1998);

const users = [
  {
    _id: '6076e77094939b511ceeaf31',

    email: 's_kulaev@break.ru',

    login: 'kulaev',

    password: 'Kulaev6324ab',

    name: 'Сергей',

    surname: 'Кулаев',

    patronymic: 'Юрьевич',

    birthdate: date,

    telephone: '89294711872',
  },
  {
    _id: '6076e77094939b511ceeaf32',

    email: 's_shitov@break.ru',

    login: 'shitov',

    password: 'Kulaev6324ab',

    name: 'Степан',

    surname: 'Шитов',

    patronymic: 'Олегович',

    birthdate: date,

    telephone: '89294711888',
  },
  {
    _id: '6076e77094939b511ceeaf34',

    email: 's_ruban@break.ru',

    login: 'ruban',

    password: 'Kulaev6324ab',

    name: 'Денис',

    surname: 'Рубан',

    patronymic: 'Витальевич',

    birthdate: date,

    telephone: '89294711777',
  },
];

beforeAll(async () => {
  await mongoose.connect(database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await mongoose.connection.db.dropDatabase();
  let model = mongoose.model('User', UserSchema, 'users');
  console.log(await model.create(users[0]));
  console.log(await model.create(users[1]));
  try {
    console.log(await model.create(users[2]));
  } catch (e) {
    console.log(e);
  }
});

afterAll(async done => {
  await mongoose.disconnect(done);
});

it('load', () => {
  expect(2 + 1).toBe(2);
});
