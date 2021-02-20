import { HttpStatus } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { LoginDTO, RegisterDTO } from 'src/user/dto/user.dto';
import * as request from 'supertest';

const app = `http://localhost:4000`;
const database = 'mongodb://localhost:27017/nest-write';

beforeAll(async () => {
  await mongoose.connect(database);
  await mongoose.connection.db.dropDatabase();
});

afterAll(async done => {
  await mongoose.disconnect(done);
});

describe('AUTH', () => {
  const user: RegisterDTO = {
    login: 'username',
    password: 'password',
  };

  const userLogin: LoginDTO = {
    login: 'username',
    password: 'password',
  };

  let userToken: string;

  it('should register user', () => {
    return request(app)
      .post('/auth/register')
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
        expect(body.user.login).toEqual('username');
        expect(body.user.password).toBeUndefined();
      })
      .expect(HttpStatus.CREATED);
  });

  it('should reject duplicate registration', () => {
    return request(app)
      .post('/auth/register')
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        expect(body.message).toEqual('User already exists');
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('should login user', () => {
    return request(app)
      .post('/auth/login')
      .set('Accept', 'application/json')
      .send(userLogin)
      .expect(({ body }) => {
        userToken = body.token;

        expect(body.token).toBeDefined();
        expect(body.user.login).toEqual('username');
        expect(body.user.password).toBeUndefined();
      })
      .expect(HttpStatus.CREATED);
  });

  it('current user', () => {
    return request(app)
      .get('/user')
      .set('Accept', 'application/json')
      .set('Authorization', `Token ${userToken}`)
      .expect(200);
  });
});
