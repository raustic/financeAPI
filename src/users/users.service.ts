import { Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { collector } from 'src/admin/collector.entity';
import { Treasurer } from 'src/admin/treasurer.entity';
import { LoginModel } from 'src/loginModel';
import { UpdatePasswordDTO } from 'src/UpdatePwdDto';
import { ResponseMessage } from 'src/userMessage';
import { getManager, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User)private userRepository:Repository<User>,
    @InjectRepository(collector)private _collectorRepo:Repository<collector>,
    @InjectRepository(Treasurer)private _treaRepo:Repository<Treasurer>
    ){

    }
   async findAll():Promise<User[]>{
    return await this.userRepository.find();
    }
    async createUser(user:User):Promise<any>{
        var query=`select count(*) as count from user where mobile='${user.mobile}'`;
        var  record=await this.userRepository.query(query);
         if(record[0]["count"]>0)
         {
             return({
             message:"User Already Exist Try New One",
             status:false
             });
            
         }
         else{
             this.userRepository.create(user);
             this.userRepository.save(user);
            return({
                message:"User Created Successfully",
                status:true
            })
         
         }

         return record;
         
    }
     IsUserExist(mobile:any):boolean{
        var record=this.userRepository.find({where:{mobile:mobile}});
        if(record!=null)
        {
            return  true;
        }
        return  false;
    }
   async LoginUser(userData:LoginModel):Promise<any>
    {
        let username=userData.userName;
        let pwd=userData.pwd;
        try{
            //admin Login
            if(userData.role==0)
            {
                const user=await this.userRepository.findOne({
                    where:{mobile:userData.userName,password:userData.pwd}
                });
                if(!user){
                    return({
                        message:"Invalid Credentials",
                        status:false,
                        
                    });
                }
                return ({
                    message:"Admin Login Made Successfully",
                    status:true,
                    record:[user]
                });
            }
            //collector Login
            if(userData.role==1)
            {
                
                const _manager=getManager();
                
                var query=`select name as firstname,'' as lastname,mobile,addressLine1,addressLine2,Zip,State as States,password,
                case isActive when 1 then true else false end   as isActive,createdAt,Id from collector 
                where mobile='${username}' and password='${pwd}'`;
                // const user=await this._collectorRepo.findOne({
                //     where:{mobile:userData.userName,Password:userData.pwd}
                // });
                const user=await _manager.query(query);
                let userData:any;
                if(Array(user).length>0)
                {
                    userData=user;
                }
                else{
                    userData=[user];
                }
                if(!user){
                    return({
                        message:"Invalid Credentials",
                        status:false,
                       
                    });
                }
                return ({
                    message:"Collector Login Made Successfully",
                    status:true,
                    record:userData
                });
            }

            if(userData.role==2)
             {
                 
                const _manager=getManager();
                 var query=`select name as firstname,'' as lastname,mobile,addressLine1,addressLine2,Zip,State as States,password,
                                 case isActive when 1 then true else false end   as isActive,createdAt,Id from treasurer where mobile='${userData.userName}' and password='${userData.pwd}'`;
                                 const user=await _manager.query(query);
                 //const user=await this._treaRepo.findOne({
            //         where:{mobile:userData.userName,Password:userData.pwd}
            //     });
                if(!user){
                    return({
                        message:"Invalid Credentials",
                        status:false,
                       
                    });
                }
                return ({
                    message:"Treasurer Login Made Successfully",
                    status:true,
                    record:user
                });
            }
        }
        catch(e){
            return({
                message:"Something Went Wrong"+e.message,
                status:false
            });
        }
       
            
    }

    findRecord(userData:LoginModel):Promise<any>
    {
        let record=this.userRepository.findOne({
            where:{mobile:userData.userName,password:userData.pwd,UserType:userData.role}
        });
        return record;
    }

    async UpdateUserPwd(dto:UpdatePasswordDTO):Promise<any>
    {
        try{
            //For Admin Password Update 
            if(dto.UserType==0)
            {
                const record=await this.userRepository.findOne({where:{mobile:dto.mobile}});
                if(!record)
                {
                    return({
                        message:"Record Not found",
                        status:false
                    });
                }
                if(record.password!=dto.currentPwd)
                {
                    return ({
                        message:"Current Password is not Correct",
                        status:false
                    });
                }
                record.password=dto.newPwd;
                this.userRepository.update(record.id,record); 
                this.userRepository.save(record);
                return({
                    message:"Admin Password Changed Successfully",
                    status:true
                });
            }

            //For Collector Password Update
            if(dto.UserType==1)
            {
                const record=await this._collectorRepo.findOne({where:{mobile:dto.mobile}});
                if(!record)
                {
                    return({
                        message:"Record Not found",
                        status:false
                    });
                }
                if(record.Password!=dto.currentPwd && dto.IsPasswordChangedByAdmin==0)
                {
                    return ({
                        message:"Current Password is not Correct",
                        status:false
                    });
                }
                record.Password=dto.newPwd;
                this._collectorRepo.update(record.id,record); 
                this._collectorRepo.save(record);
                return({
                    message:"Collector Password Changed Successfully",
                    status:true
                });
            }

            //for Treasures Password Update 
            if(dto.UserType==2)
            {
                const record=await this._treaRepo.findOne({where:{mobile:dto.mobile}});
                if(!record)
                {
                    return({
                        message:"Record Not found",
                        status:false
                    });
                }
                if(record.Password!=dto.currentPwd && dto.IsPasswordChangedByAdmin==0)
                {
                    return ({
                        message:"Current Password is not Correct",
                        status:false
                    });
                }
                record.Password=dto.newPwd;
                this._treaRepo.update(record.id,record); 
                this._treaRepo.save(record);
                return({
                    message:"Tresurer Password Changed Successfully",
                    status:true
                });
            }
          
           
           

        }
        catch(e)
        {
            return ({
                message:"Something Went Wrong",
                status:false
            });
        }
    }


    

}
