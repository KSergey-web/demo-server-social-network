import 'dotenv/config';

export const app = `http://localhost:${process.env.PORT}/api`;
export const database = process.env.MONGODB_WRITE_CONNECTION_STRING;
