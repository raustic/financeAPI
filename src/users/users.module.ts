import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { collector } from 'src/admin/collector.entity';
import { Treasurer } from 'src/admin/treasurer.entity';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    imports:[TypeOrmModule.forFeature([User,collector,Treasurer])],
    providers:[UsersService],
    controllers:[UsersController]
})
export class UsersModule {}
