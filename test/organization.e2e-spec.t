import { HttpStatus } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { CreateOrganizationDTO } from 'src/organization/dto/organization.dto';
import { OrganizationDocument } from 'src/organization/schemas/organization.schema';
import { LoginDTO, RegisterDTO } from 'src/user/dto/user.dto';
import * as request from 'supertest';

const app = `http://localhost:4000`;
const database = 'mongodb://localhost:27017/nest-write';

beforeAll(async () => {
  await mongoose.connect(database);
  await mongoose.connection.db.dropDatabase();
});

afterAll(async done => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect(done);
});

// describe('Create organization', () => {

//   const user: RegisterDTO = {
//     login: 'username',
//     password: 'password',
//   };

//   const userLogin: LoginDTO = {
//     login: 'username',
//     password: 'password',
//   };

//   const organization: CreateOrganizationDTO = {
//     name: 'org',
//     description: 'desc',
//     avatar: 'ava'
//   };

//   let userToken: string;

//   it('should register user', () => {
//     return request(app)
//       .post('/auth/register')
//       .set('Accept', 'application/json')
//       .send(user)
//       .expect(({ body }) => {
//         expect(body.token).toBeDefined();
//         expect(body.user.login).toEqual('username');
//         expect(body.user.password).toBeUndefined();
//       })
//       .expect(HttpStatus.CREATED);
//   });

//   it('should reject duplicate registration', () => {
//     return request(app)
//       .post('/auth/register')
//       .set('Accept', 'application/json')
//       .send(user)
//       .expect(({ body }) => {
//         expect(body.message).toEqual('User already exists');
//       })
//       .expect(HttpStatus.BAD_REQUEST);
//   });

//   it('should login user', () => {
//     return request(app)
//       .post('/auth/login')
//       .set('Accept', 'application/json')
//       .send(userLogin)
//       .expect(({ body }) => {
//         userToken = body.token;

//         expect(body.token).toBeDefined();
//         expect(body.user.login).toEqual('username');
//         expect(body.user.password).toBeUndefined();
//       })
//       .expect(HttpStatus.CREATED);
//   });

//   it('should create organization', () => {
//     return request(app)
//       .post('/organization')
//       .set('Accept', 'application/json')
//       .set('Authorization', `Token ${userToken}`)
//       .send(organization)
//       .expect(({ body }) => {
//         expect(body.organization.name).toEqual(organization.name);
//         expect(body.organization.description).toEqual(organization.description);
//         expect(body.organization.avatar).toEqual(organization.avatar);
//       });
//   });
// });

describe('Delete Organization', () => {
  const admin: RegisterDTO = {
    login: 'username',
    password: 'password',
  };

  let adminToken: string;

  it('reg', () => {
    return request(app)
      .post('/auth/register')
      .set('Accept', 'application/json')
      .send(admin)
      .expect(({ body }) => {
        console.log(body);
        adminToken = body.token;
      });
  });

  const organization: CreateOrganizationDTO = {
    name: 'org',
    description: 'desc',
    avatar: 'ava',
  };

  let id;
  it('create org', () => {
    return request(app)
      .post('/organization')
      .set('Accept', 'application/json')
      .set('Authorization', `Token ${adminToken}`)
      .send(organization)
      .expect(({ body }) => {
        console.log(body);
        id = body.organization._id;
        expect(body.organization.name).toEqual(organization.name);
        expect(body.organization.description).toEqual(organization.description);
        expect(body.organization.avatar).toEqual(organization.avatar);
      });
  });

  it('should delete organization', () => {
    return request(app)
      .delete(`/organization/${id}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Token ${adminToken}`)
      .send()
      .expect(({ body }) => {
        console.log(body);
        expect(body.organization.name).toEqual(organization.name);
        expect(body.organization.description).toEqual(organization.description);
        expect(body.organization.avatar).toEqual(organization.avatar);
      });
  });
});
