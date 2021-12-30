import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ok } from 'assert';
import { CommonEntityModel } from 'src/CommonEntityModel';
import { imageUploadDto } from 'src/imageUploadDto';
import { UpdatePasswordDTO } from 'src/UpdatePwdDto';
import { ResponseMessage } from 'src/userMessage';
import { createConnection, getManager, Repository } from 'typeorm';
import { receiveMessageOnPort } from 'worker_threads';
import { borrower } from '../borrower.entity';
import { collector } from '../collector.entity';

import { lender } from '../lender.entity';
import { TransactionService } from '../transaction/transaction.service';
import { Treasurer } from '../treasurer.entity';
import { ToWords } from 'to-words';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(lender)private lenderRepo:Repository<lender>,
        @InjectRepository(borrower)private borrowerRepo:Repository<borrower>,
        @InjectRepository(collector)private collectorRepo:Repository<collector>,
        @InjectRepository(Treasurer)private treaRepo:Repository<Treasurer>,
        private _transService:TransactionService)
    {

    }
    //Lender Entity Start Here
    async GetLenders(id:number):Promise<lender[]>
    {
        if(id==1)
        {
            return await this.lenderRepo.find({where:{isActive:1}});
        }
        if(id==0)
        {

            return await this.lenderRepo.find({where:{isActive:0}});
        }
    }
    
    async CreateLender(@Body()ety:lender):Promise<any>
    {
       var res=new ResponseMessage();
      
         try{
             var query=`select count(*) as count from lender where Mobile=${ety.mobile} and isactive=1`;
            var  record=await this.lenderRepo.query(query);
             if(record[0]["count"]>0)
             {
                 res.message="Lender Already Exist";
                 res.status=false
             }
             else{
                this.lenderRepo.create(ety);
                this.lenderRepo.save(ety);
                res.message="Lender Profile Created Successfully";
                res.status=true
             
             }
                
        
         }
         catch(e)    
         {
           res.message="Something Went Wrong";
            res.status=true ;
         }
         return res;
    } 
    
    async UpdateLender(@Body()ety:lender):Promise<any>
    {
        var res=new ResponseMessage();
        try{
            var updatequery="";
            var lender=await this.lenderRepo.findOne({id:ety.id});
            lender.CreatedAt=ety.CreatedAt;
            lender.State=ety.State;
            lender.name=ety.name;
            lender.isActive=ety.isActive;
            lender.addressLine1=ety.addressLine1;
            lender.addresslLine2=ety.addresslLine2;
            lender.Zip=ety.Zip;
            lender.State=ety.State;
            lender.Designation=ety.Designation;
            await this.lenderRepo.update(lender,{id:ety.id});
            this.lenderRepo.save(lender);
            res.message="Record Updated Successfully";
            res.status=true;


            
            

        }
        catch(e ){
            res.message="Something Went Wrong";
            res.status=false;
        } 
        return res;
    }
    async DeleteLender(@Body() ety:CommonEntityModel)
    {
        var _res=new ResponseMessage();
        try{
            
        this.lenderRepo.delete({id:ety.id});
        _res.message="Record Deleted Successfully",
        _res.status=true
        }
        catch(e){
            _res.message="Something Went Wrong";
            _res.status=false
        } 
        return _res ;
        
    }
    //Lender Entity Ends here

    //Borrower  repo start Here -2 for active -1 for deactivate and 0 for all
    // and on id get all record with transaction 
    async GetBorrowers(id:number,order:string):Promise<any>
    {
        
    const _manager=getManager();
        if(id==-2)
        {
            
        return await this.borrowerRepo.find({where:{IsActive:1}});
        }
        if(id==-1)
        {
            return await this.borrowerRepo.find({where:{IsActive:0}});
        }
        if(id==0)
        {
            switch(order)
            {
                case 'az':
                var query=`
                // select id,name,watsappnumber,email,mobile,addressline1,addressline2,zip,state,referencedBy,createdBy,date_format(createdAt,'%d-%m-%Y %H:%i:%s')as createdAt ,isactive,designation,profileImg,aadharfrontimg,aadharbackimg,otherimg,
                // ((select ifnull(sum(returnAmt),0) from borrowertrans where borrowerid=A.id)-(select  ifnull(sum(returnAmt),0) from borrower_trans_return where borrowerid=A.id and IsAdminApproved=1 and IsTreasurerApproved=1))as Bal
                //  from borrower as A order by name`; 
                var query=`select id,name,watsappnumber,email,mobile,addressline1,addressline2,zip,state,referencedBy,createdBy,date_format(createdAt,'%d-%m-%Y %H:%i:%s')as createdAt ,isactive,designation,profileImg,aadharfrontimg,aadharbackimg,otherimg,
                (select ifnull(sum(returnAmt),0) from borrower_trans_return where  isAdminApproved=0 and IsTreasurerApproved=0 and borrowerid=A.id)as Bal
                  from borrower as A order by name`;  
                    const user=await _manager.query(query);
                     
                    if(Array(user).length>0)
                    {
                        return user;
                    }
                    else{
                        return [user];
                    }
                break;
                case 'za':
                    // var query1=`
                    // select A.id,A.name,A.watsappnumber,A.email,A.mobile,A.addressline1,A.addressline2,A.zip,A.state,A.referencedBy,A.createdBy,date_format(A.createdAt,'%d-%m-%Y %H:%i:%s')as createdAt ,A.isactive,A.designation,A.profileImg,A.aadharfrontimg,A.aadharbackimg,A.otherimg,
                    // ((select ifnull(sum(returnAmt),0) from borrowertrans where borrowerid=A.id)-(select  ifnull(sum(returnAmt),0) from borrower_trans_return where borrowerid=A.id and IsAdminApproved=1 and IsTreasurerApproved=1))as Bal
                    // from borrower as A order by name desc  
                    //                `;
                    var query1=`select id,name,watsappnumber,email,mobile,addressline1,addressline2,zip,state,referencedBy,createdBy,date_format(createdAt,'%d-%m-%Y %H:%i:%s')as createdAt ,isactive,designation,profileImg,aadharfrontimg,aadharbackimg,otherimg,
                (select ifnull(sum(returnAmt),0) from borrower_trans_return where  isAdminApproved=0 and IsTreasurerApproved=0 and borrowerid=A.id)as Bal
                  from borrower as A order by name desc`;  
                       const user1=await _manager.query(query1);
                     
                    if(Array(user1).length>0)
                    {
                        return user1;
                    }
                    else{
                        return [user1];
                    }    
                      
                break;
                case 'up':
                //var query2=`
                // select  A.*,
                // ((select sum(returnAmt)from borrower_trans_return where borrowerid=A.Id)-
                // (select sum(amount) from borrowertrans where borrowerid=A.id)) as Bal
                // from borrower as A order by bal`  
                var query2=`select id,name,watsappnumber,email,mobile,addressline1,addressline2,zip,state,referencedBy,createdBy,date_format(createdAt,'%d-%m-%Y %H:%i:%s')as createdAt ,isactive,designation,profileImg,aadharfrontimg,aadharbackimg,otherimg,
                ((select ifnull(sum(returnAmt),0) from borrowertrans where borrowerid=A.id)-(select  ifnull(sum(returnAmt),0) from borrower_trans_return where borrowerid=A.id and IsAdminApproved=1 and IsTreasurerApproved=1))as Bal
                from borrower as A order by bal `; 
                var data=await _manager.query(query2); 
                if(Array(data).length>0)
                {
                    return data;
                }
                else{
                    return [data];
                }
                break;
                case 'down':
                //     var query=`
                // select  A.*,
                // ((select sum(returnAmt)from borrower_trans_return where borrowerid=A.Id)-
                // (select sum(amount) from borrowertrans where borrowerid=A.id)) as Bal
                // from borrower as A order by bal desc`
                var query3=`select id,name,watsappnumber,email,mobile,addressline1,addressline2,zip,state,referencedBy,createdBy,date_format(createdAt,'%d-%m-%Y %H:%i:%s')as createdAt ,isactive,designation,profileImg,aadharfrontimg,aadharbackimg,otherimg,
                ((select ifnull(sum(returnAmt),0) from borrowertrans where borrowerid=A.id)-(select  ifnull(sum(returnAmt),0) from borrower_trans_return where borrowerid=A.id and IsAdminApproved=1 and IsTreasurerApproved=1))as Bal
                from borrower as A order by bal desc`;    
                var data1=await _manager.query(query3);
                if(Array(data1).length>0)
                {
                    return data1;
                }
                else{
                    return [data1];
                }
                break;
            }  
            //return await this.borrowerRepo.find();
        }
        if(id>0)
        {
            var profile=await this.borrowerRepo.find({where:{id:id}});
            var borrowerAllTrans=await this._transService.GetBorrowerAllTransaction(id);
            var pendingPayments=await this._transService.GetPendingPayment(id);
            var getborroweracc=await this._transService.GetBorrowerAccount(id);
            var userProfilewidRecord={
                profile:profile,
                allTrans:borrowerAllTrans,
                pendTrans:pendingPayments,
                account:getborroweracc
            };

            return await userProfilewidRecord;
            
        }

    }
   
    async CreateBorrower(ety:borrower):Promise<any>
    {
       var res=new ResponseMessage();
      
         try{
             var query=`select count(*) as count from borrower where Mobile=${ety.mobile} and isactive=1`;
            var  record=await this.lenderRepo.query(query);
             if(record[0]["count"]>0)
             {
                 res.message="Borrower Already Exist";
                 res.status=false
             }
             else{
                this.borrowerRepo.create(ety);
                this.borrowerRepo.save(ety);
                res.message="Borrower Profile Created Successfully";
                res.status=true
             
             }
                
        
         }
         catch(e)    
         {
           res.message=e.message;
            res.status=true ;
         }
         return res;
    } 
    
    async UpdateBorrower(@Body()ety:borrower):Promise<any>
    {
        var res=new ResponseMessage();
        try{
            var updatequery="";
            var lender=await this.borrowerRepo.findOne({id:ety.id});
            lender.CreatedAt=ety.CreatedAt;
            lender.watsappNumber=ety.watsappNumber;
            lender.CreatedBy=ety.CreatedBy;
            lender.state=ety.state;
            lender.name=ety.name;
            lender.IsActive=ety.IsActive;
            lender.addressLine1=ety.addressLine1;
            lender.addressLine2=ety.addressLine2;
            lender.zip=ety.zip;
            lender.state=ety.state;
            lender.ReferencedBy=ety.ReferencedBy;
            lender.Designation=ety.Designation;
            await this.borrowerRepo.update(lender,{id:ety.id});
            this.borrowerRepo.save(lender);
            res.message="Record Updated Successfully";
            res.status=true;

            
            


            
            

        }
        catch(e ){
            res.message="Something Went Wrong";
            res.status=false;
        } 
        return res;
    }
    async DeleteBorrower(@Body()ety:CommonEntityModel)
    {
        var _res=new ResponseMessage();
        try{
            
        this.borrowerRepo.delete({id:ety.id});
        _res.message="Record Deleted Successfully",
        _res.status=true
        }
        catch(e){
            _res.message="Something Went Wrong";
            _res.status=false
        } 
        return _res ;
        
    }
    
//borrower repo ends Here

//Collector Repo Starts Here
async GetCollectors(id:number):Promise<any>
{
    const _manager=getManager();
    //Get All De-activate Collector
    if(id==-2)
    {
        return await this.collectorRepo.find({where:{IsActive:0}});
    }
    //Get All Activate Collector
    if(id==-1)
    {
        return await this.collectorRepo.find({where:{IsActive:1}});
    }
    if(id==0)
    {
        return await this.collectorRepo.find();
    }
    if(id>0)
    {
        let collectorProfile=await this.collectorRepo.find({where:{id:id}});
        let query=`
        select * from collectorlead where date(returndate)=curdate() and collectorId=${id}`;
        let data=await _manager.query(query);
        var profileandLead={
            profile:collectorProfile,
            lead:data
        };
        return profileandLead;
        
    }
    return await this.collectorRepo.find({where:{IsActive:1}});
}

async CreateCollector(ety:collector):Promise<any>
{
   var res=new ResponseMessage();
  
     try{
         var query=`select count(*) as count from collector where Mobile=${ety.mobile}`;
        var  record=await this.collectorRepo.query(query);
         if(record[0]["count"]>0)
         {
             res.message="Collector Already Exist";
             res.status=false
         }
         else{
             ety.Password=ety.mobile;
            this.collectorRepo.create(ety);
            this.collectorRepo.save(ety);
            res.message="Collector Profile Created Successfully";
            res.status=true
         
         }
            
    
     }
     catch(e)    
     {
       res.message="Something Went Wrong";
        res.status=true ;
     }
     return res;
} 

async UpdateCollector(@Body()ety:collector):Promise<any>
{
    var res=new ResponseMessage();
    try{
        var updatequery="";
        var lender=await this.collectorRepo.findOne({id:ety.id});
        lender.CreatedAt=ety.CreatedAt;
        lender.watsappNumber=ety.watsappNumber;
        lender.CreatedBy=ety.CreatedBy;
        lender.State=ety.State;
        lender.name=ety.name;
        lender.IsActive=ety.IsActive;
        lender.addressLine1=ety.addressLine1;
        lender.addressLine2=ety.addressLine2;
        lender.Zip=ety.Zip;
        lender.Designation=ety.Designation;
        await this.collectorRepo.update(lender,{id:ety.id});
        this.collectorRepo.save(lender);
        res.message="Record Updated Successfully";
        res.status=true;
    }
    catch(e ){
        res.message="Something Went Wrong";
        res.status=false;
    } 
    return res;
}
async DeleteCollector(@Body()ety:CommonEntityModel)
{
    var _res=new ResponseMessage();
    try{
        
    this.collectorRepo.delete({id:ety.id});
    _res.message="Record Deleted Successfully",
    _res.status=true
    }
    catch(e){
        _res.message="Something Went Wrong";
        _res.status=false
    } 
    return _res ;
    
}
//Collector repo Ends Here

//Active/Deactivate Borrower, Collector,Lender
async ActiveDeactivateBorrower(cto:CommonEntityModel):Promise<any>{
    
    const record=await this.borrowerRepo.findOne(cto.id);
if(!record){
   
    return({
        message:"Record Not Found",
        status:false
    });
}
record.IsActive=cto.activeStatus;
this.borrowerRepo.update(cto.id,record);
this.borrowerRepo.save(record);
if(cto.activeStatus==1)
{
    return({
        message:"Borrower Activated Successfully",
        status:true
    });
}
if(cto.activeStatus==0)
{
    return ({
        message:"Borrower De-Activated Successfully",
        status:true
    });
}

 
 
}

async ActiveDeactivateLender(cto:CommonEntityModel):Promise<any>
{
    const record=await this.lenderRepo.findOne(cto.id);
    if(!record)
    {
    return ({
        message:"Record Not Found",
        status:false
    });
    }
    record.isActive=cto.activeStatus;
    this.borrowerRepo.update(cto.id,record);
    this.borrowerRepo.save(record);
    if(cto.activeStatus==1)
    {
        return ({
            message:"Lender Activted Successfully",
            status:true
        });
    }
    if(cto.activeStatus==0)
    {
        return({
            message:"Lender De-activated Successfully",
            status:true
        });
    }
    
}

async ActiveDeactivateCollector(cto:CommonEntityModel):Promise<any>
{
    const record=await this.collectorRepo.findOne({where:{id:cto.id}});
    if(!record)
    {
        return({
            message:"Record not Found",
            status:false
        });
    }
    record.IsActive=cto.activeStatus;
    this.collectorRepo.update(cto.id,record);
    
    if(cto.activeStatus==1)
    {
        return({
            message:"Activated Successfully",
            status:true
        });
    }
    if(cto.activeStatus==0)
    {
return ({
    message:"Deactivated Sucessfully",
    status:true
});
    }

}

//Create Treasure Profile
//-1 for active and 0 from inactive and id >0 for all transaction with profile
async GetTreasuerers(id:number):Promise<any>
{
    //Active
    if(id==-2)
    {
        return this.treaRepo.find({where:{IsActive:1}});
    }
    //Inactive
    if(id==-1)
    {
        return this.treaRepo.find({where:{IsActive:0}});
    }
    //All
    if(id==0)
    {
        return this.treaRepo.find();
    }
    if(id>0)
    {
        var profile=await this.treaRepo.find({where:{id:id}});
       
        const _manager=getManager();
        var query=`
        
        select A.*,B.* from borrower_trans_return as A join borrower as B on A.borrowerId=B.id
        where returndate<=curdate() and IsTreasurerApproved=0`;
        
        var data=await _manager.query(query);
        var retData={
            profile:profile,
            tarns:data
        }
        return ({
            profile:profile,
            trans:data
        });     
    }
    
}

async CreateTreasurer(dto:Treasurer):Promise<any>
{
    try{
        var query=`select count(*) as count from treasurer where Mobile=${dto.mobile}`;
        var  record=await this.treaRepo.query(query);
         if(record[0]["count"]>0)
         {
             return({
                 message:"Treasurer Already Exist",
                 status:false
             });
         }
         else{
             dto.Password=dto.mobile;
            this.treaRepo.create(dto);
            this.treaRepo.save(dto);
            return({
                message:"Treasures Profile Created Successfully",
                status:true
            });
         } 
    }
    catch(e){
  return({
      message:"Something Went Wrong",
      status:false
  });
    }
}
async UpdateTreasures(dto:Treasurer):Promise<any>
{
    try{
     var record=await this.treaRepo.findOne(dto.id);
     record.name=dto.name;
     record.watsappNumber=dto.watsappNumber;
     record.addressLine1=dto.addressLine1;
     record.addressLine2=dto.addressLine2;
     record.Zip=dto.Zip;
     record.State=dto.Zip;
     record.city=dto.city;
     record.city=dto.CreatedBy;
     record.CreatedAt=dto.CreatedAt;
     record.Designation=dto.Designation;
     record.IsActive=dto.IsActive;
     this.treaRepo.update(dto.id,record);
     this.treaRepo.save(record);
     return ({
         message:"Record Updated Succesfully",
         status:true
     });
    }
    catch(e)
    {
        return ({
            message:"Something Went Wrong",
            status:false
        });
    }
}
async ActivateNDeactivateTeasures(dto:CommonEntityModel):Promise<any>
{
    try{
        var record=await this.treaRepo.findOne(dto.id);
        record.IsActive=dto.activeStatus;
        this.treaRepo.update(dto.id,record);
        this.treaRepo.save(record);
        if(dto.activeStatus==1)
        {
            return({
                message:"Treasurer Activated Successfully",
                status:true
            });
        }
        if(dto.activeStatus==0)
        {
            return({
                message:"Treasurer De-activated Successfully",
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

async SaveImage(dto:imageUploadDto):Promise<any>
{
    
    const _manager=getManager();
    var imgpath=require('path');

    var base64ToImage = require('base64-to-image');
    var base64Str = dto.image;
    var path ='./public/';
    
        //1 for profile image
    if(dto.type=="1")
    {
            try{
                let filename=`prf${dto.mobile}.png`
            let query=`update borrower set ProfileImg='${filename}' where mobile='${dto.mobile}'`;
            var optionalObj = {'fileName':filename, 'type':'png'};
            base64ToImage(base64Str,path,optionalObj); 
            var imageInfo = base64ToImage(base64Str,path,optionalObj);
            
            _manager.query(query);
            return({
                 message:"Profile Image Saved Successfully",
                 staus:true
             });
            }
            catch(e){
                    return({
                        message:e.message,
                        status:false
                    });
            } 
        }
        if(dto.type=="2")
        {
        //2 for aadhar front image

        
                try{
                let filename=`adhf${dto.mobile}.png`
                let query=`update borrower set aadharfrontImg='${filename}' where mobile='${dto.mobile}'`;
                var optionalObj = {'fileName':filename, 'type':'png'};
                base64ToImage(base64Str,path,optionalObj); 
                var imageInfo = base64ToImage(base64Str,path,optionalObj);
                _manager.query(query);
                return({
                     message:"Aadhar Front Image Saved Successfully",
                     status:true
                 });
                }
                catch(e){
                    return({
                        message:e.message,
                        status:false
                    });
            } 
            }
              
        //3 for aadhar back image
        if(dto.type=="3")
        {
            try{
                let filename=`adhb${dto.mobile}.png`
                let query=`update borrower set aadharbackImg='${filename}' where mobile='${dto.mobile}'`;
                var optionalObj = {'fileName':filename, 'type':'png'};
                base64ToImage(base64Str,path,optionalObj); 
                var imageInfo = base64ToImage(base64Str,path,optionalObj);
                _manager.query(query);
                return({
                     message:"Aadhar Back Image Saved Successfully",
                     status:true
                 });
                }
                catch(e){
                    return({
                        message:e.message,
                        status:false
                    });
            } 
            } 
        //4 for other image
       
            if(dto.type=="4")
            {
            try{
                let filename=`oth${dto.mobile}.png`
                let query=`update borrower set otherImg='${filename}' where mobile='${dto.mobile}'`;
                var optionalObj = {'fileName':filename, 'type':'png'};
                base64ToImage(base64Str,path,optionalObj); 
                var imageInfo = base64ToImage(base64Str,path,optionalObj);
                _manager.query(query);
                return({
                     message:"Other  Image Saved Successfully",
                     status:true
                 });
                }
                catch(e){
                    return({
                        message:e.message,
                        status:false
                    });
            } 
                    }
    }   

    async ConvertWords(fig:number):Promise<any>
    {
        const toWords = new ToWords();
        let words = toWords.convert(fig, { currency: true });
        return words;
    }


}
