import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { writeFileSync } from 'fs';
import path, { join } from 'path';
import { AppModule } from './app.module';
import * as express from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // const config=new DocumentBuilder().
  // setTitle('Finance App API')
  // .setDescription('Finnace APP API')
  // .setVersion('1.0')
  // .addTag('Build').build();
  // const document = SwaggerModule.createDocument(app, config);
  // const outputPath = path.resolve(process.cwd(), 'swagger.json');
  // writeFileSync(outputPath, JSON.stringify(document), { encoding: 'utf8'});
  app.useStaticAssets(join(__dirname,'..','public'));
  const options = new DocumentBuilder()
  .setTitle('Finance API')
  .setDescription('API description')
  .setVersion('1.0')
  .build();

  app.use(json({limit:'50mb'}));
  app.use(urlencoded({extended:true,limit:'50mb'}));
  //app.use(express.static(join(process.cwd(), '../client/dist/')));
  
  app.useStaticAssets(join(__dirname, '..', 'public'),{
    prefix:'/public/'
  });
  app.use('/public', express.static(join(__dirname, '..', 'public')));
const document = SwaggerModule.createDocument(app, options);
SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
