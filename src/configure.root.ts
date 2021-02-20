import { ConfigModule } from '@nestjs/config';
//test
export const configModule = ConfigModule.forRoot({
  //envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
  envFilePath: `.env.development`,
  isGlobal: true,
});
