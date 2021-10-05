import { Body, Controller, Get, HttpCode, Post,Query } from '@nestjs/common';
import { query } from 'express';
import { LoginModel } from 'src/loginModel';
import { UpdatePasswordDTO } from 'src/UpdatePwdDto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private UserService:UsersService){

    }
    @Get('GetUsers')
     index():Promise<User[]>{
       return this.UserService.findAll();
     }
     @Post('createUser')
     async createUser(@Body()UserData:User):Promise<any>{
       UserData.isActive=true;
       var res=this.UserService.createUser(UserData);
       return res;
     }

     @Post('loginUser')
     @HttpCode(200)
     async loginUser(@Body()login:LoginModel):Promise<any>{

       var _res=this.UserService.LoginUser(login);
       return _res ; 
}
@Post('ChangeAdminPassword')
async ChangeAdminPassword(@Body()dto:UpdatePasswordDTO)
{
  var res=this.UserService.UpdateUserPwd(dto);
  return res;
}

}