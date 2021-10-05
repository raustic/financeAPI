import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import{ServeStaticModule} from '@nestjs/serve-static';
import { join } from 'path';
@Module({
  imports: [
  TypeOrmModule.forRoot(),
  UsersModule,
  AdminModule,
 ServeStaticModule.forRoot({
   rootPath:join(__dirname,'..','public')
 }) ],
  controllers: [AppController],
  providers: [AppService],
  
  
})
export class AppModule {
  constructor(private connection:Connection){
    
  }
}
