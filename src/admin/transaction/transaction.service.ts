import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ok } from 'assert';
import { animationFrameScheduler } from 'rxjs';
import {  borrowerTransQueryModel } from 'src/borrowerTransQueryModel';
import { CommonEntityModel } from 'src/CommonEntityModel';
import { periodicTransHistory } from 'src/periodicTransHistory';
import { TransactionStatusModel } from 'src/TransactionStatusModel';
import { ResponseMessage } from 'src/userMessage';
import { Repository,createConnection,createConnections,Connection,getConnection,EntityManager, getConnectionManager, getManager, Any } from 'typeorm';

import { UpdateBalModel } from 'src/updateOpeningBalModel';
import { borrower } from '../borrower.entity';
import { borrowertrans } from '../borrowertrans.entity';
import { borrowerTransReturn } from '../borrowerTransReturn.entity';
import { collectorlead } from '../collectorlead.entity';
import { lendertrans } from '../lendertrans.entity';
import { approveTrans } from './ApproveDataModel';
import { ApproveTrans } from './ApproveTransModel';
import { OpeningBal } from './openingBal.entity';


@Injectable()
export class TransactionService {
    constructor(@InjectRepository(borrowertrans)private _borrowerTrans:Repository<borrowertrans>,
                @InjectRepository(lendertrans)private _lenderTrans:Repository<lendertrans>,
                @InjectRepository(borrower)private _borrowerRepo:Repository<borrower>,
                @InjectRepository(borrowerTransReturn)private _borrowerTransReturn:Repository<borrowerTransReturn>,
                @InjectRepository(collectorlead)private _collectorLead:Repository<collectorlead>,
                @InjectRepository(OpeningBal)private _openBal:Repository<OpeningBal> 
                ){

    }
    
    // async GetLenderTransactions(id:number):Promise<lendertrans[]>
    // {
    //     if(id==0)
    //     {

    //         return await this._lenderTrans.find();
    //     }
    //     else{
    //         return await this._lenderTrans.find({where:{lenderid:id}});
    //     }
    // }
    // async CreateLenderTrans(entity:lendertrans):Promise<any>
    // {
    //     var _res=new ResponseMessage();
    //     try{
    //             this._lenderTrans.create(entity);
    //             this._lenderTrans.save(entity);
    //             _res.message="Lender Transaction Added Succesfully"
    //             _res.status=true
    //     }
    //     catch(e ){
    //         _res.message=e.message;
    //         _res.status=false
    //     }
    //     return _res;
    // }
    // async DeleteLenderTrans(entity:CommonEntityModel)
    // {
    //     var  _res=new ResponseMessage();
    //     try{
    //         var record=this._lenderTrans.delete({id:entity.id});
    //         _res.message="Lender Transaction Deleted Succesfully";
    //         _res.status=true;
    //     }
    //     catch(e) {
    //         _res.status=e.message;
    //         _res.status=false;
    //     }
    //     return _res;
    // }
    async GetBorrowerTransactions(model:borrowerTransQueryModel):Promise<borrowertrans[]>
    {
        //if Borrower Id =0 get whole Record
        if(model.borrowerId==0 && model.transactionId==0)
        {
            return this._borrowerTrans.find();
        }
        if(model.borrowerId!=0 && model.transactionId==0)
        {
            return   this._borrowerTrans.find({where:{borrowerid:model.borrowerId}});
        }
        if(model.transactionId!=0 && model.borrowerId==0)
        {

            return this._borrowerTrans.find({where:{id:model.transactionId}});
        }
    }
    async GetPendingPayment(borrowerId:number):Promise<any[]>
    {
        
        const _manager=getManager();
        // var query=`
        // select * from borrowertrans where borrowerid=${borrowerId} and(
        // Date(ReturnDate1)<=curdate()||Date(ReturnDate2)<=curdate()||Date(ReturnDate3)<=curdate()||ReturnDate4<=curdate()||
        // ReturnDate5<=curdate()||ReturnDate6<=curdate()||ReturnDate7<=curdate()||ReturnDate8<=curdate()||
        // ReturnDate9<=curdate()||ReturnDate10<=curdate()||ReturnDate11<=curdate()||ReturnDate1<=curdate()) 
        // `;
       // var query=`
        // select returnAmt ,date_format(curdate(),'%d-%m-%Y') as Date,borrowerId,date_format(createdAt,'%d-%m-%Y %H:%i:%s') as createdAt,date_format(ReturnDate1,'%d-%m-%Y') as returnDate from borrowertrans where borrowerid=${borrowerId} and(
        //   Date(ReturnDate1)>=curdate()||Date(ReturnDate2)>=curdate()||Date(ReturnDate3)>=curdate()||ReturnDate4>=curdate()||
        //   ReturnDate5>=curdate()||ReturnDate6>=curdate()||ReturnDate7>=curdate()||ReturnDate8>=curdate()||
        //   ReturnDate9>=curdate()||ReturnDate10>=curdate()||ReturnDate1>=curdate()||ReturnDate12>=curdate())  
        //     union
        //     select (sum(returnAmt)-(select sum(returnAmt) from borrower_trans_return where borrowerid=${borrowerId}))as returnAmt,date_format(createdAt,'%d-%m-%Y')as Createdate,borrowerId,date_format(createdAt,'%d-%m-%Y') as createdAt,date_format(ReturnDate1,'%d-%m-%Y') as returnDate from borrowertrans as A where borrowerid=${borrowerId}
        //     and (ReturnDate1<curdate() or ReturnDate2<curdate() or ReturnDate3<curdate() or ReturnDate3<curdate() or ReturnDate4<curdate() or ReturnDate4<curdate() or ReturnDate5<curdate() or ReturnDate6<curdate())  
        //       `;

        
       var query=`
        select returnAmt ,date_format(curdate(),'%d-%m-%Y') as Date,borrowerId,date_format(createdAt,'%d-%m-%Y %H:%i:%s') as createdAt,date_format(ReturnDate1,'%d-%m-%Y') as returnDate from borrowertrans where borrowerid=${borrowerId} and(
          Date(ReturnDate1)>=curdate()||Date(ReturnDate2)>=curdate()||Date(ReturnDate3)>=curdate()||ReturnDate4>=curdate()||
          ReturnDate5>=curdate()||ReturnDate6>=curdate()||ReturnDate7>=curdate()||ReturnDate8>=curdate()||
          ReturnDate9>=curdate()||ReturnDate10>=curdate()||ReturnDate1>=curdate()||ReturnDate12>=curdate())`;
          let data=await _manager.query(query);
          
        return data;    
        
    }
    async GetBorrowerAccount(borrowerid:number):Promise<any>
    {
        const _manager=getManager();
        var query=`select (select sum(amount) from borrowertrans where borrowerid=${borrowerid}) as givenamt,
        (select sum(returnAmt) from borrowertrans where borrowerid=${borrowerid}) as totalReturnAmt,
        (select ifnull(sum(returnAmt),0) from borrower_trans_return where borrowerid=${borrowerid}) as receivedamt
         from borrowertrans limit 1`;
         return _manager.query(query);
    }

    async GetBorrowerAllTransaction(borrowerId:number):Promise<any[]>
    {
        const _manager=getManager();
        var query=`select amount,date_format(ReturnDate1,'%d-%m-%Y') as ReturnDate,'give'as TranType,date_format(createdAt,'%d-%m-%Y %H:%i:%s') as createdAt from borrowertrans where borrowerid=${borrowerId}
        union
        select returnAmt,date_format(ReturnDate,'%d-%m-%Y') as  ReturnDate,'receive' as TranType,date_format(createdAt,'%d-%m-%Y %H:%i:%s') as createdAt from borrower_trans_return where borrowerid=${borrowerId}
        `;
        var data=_manager.query(query);
        return data;
    }
    

    async CreateBorrowerTrans(entity:borrowertrans):Promise<any>{
        var  _res=new ResponseMessage();
        try{
            
            this._borrowerTrans.create(entity);
            this._borrowerTrans.save(entity);
            _res.status=true;
            _res.message="Borrower Transaction Made Successfully";
        }
        catch(e){
            _res.status=false;
            _res.message=e.message
        }
        return _res;
        }

        async CreateReturnBorrowerTrans(entity:borrowerTransReturn):Promise<any>
        {
            try{
                
                entity.createdAt=new Date();
                this._borrowerTransReturn.create(entity);
                this._borrowerTransReturn.save(entity);
                return{
                    message:"Transaction Made Sucessfully",
                    status:true
                };
            }
            catch(e) 
            {
                    return{
                        message:e.message,
                        status:false
                    };
            }
        }

    async DeleteBorrowerTrans(entity:CommonEntityModel):Promise<any>{
        var _res=new ResponseMessage();
        try{
            this._borrowerTrans.delete({id:entity.id});
            _res.message="Borrower Transaction Deleted Successfully"
            _res.status=true
        }
        catch(e){
            _res.message=e.message;
            _res.status=false

        }
        return _res;
        
    }

    async GetTransactionTotal():Promise<any>
    {
        var  _res=new ResponseMessage();
        try{
            var _lendTransdata=await this._lenderTrans.find();
            var _borrowTransData=await this._borrowerTrans.find();
            _lendTransdata.forEach(x=>x.amount)
        var query=`
        select (select sum(amount) from lendertrans) as Inflow, (select sum(amount) from borrowertrans)as OutFlow
         from lendertrans limit 1`;
         var  record=this._borrowerTrans.query(query);
         _res.result=record;
         _res.status=true;
         _res.message="Record Fetched Successfully";
        }
        catch(e){
            _res.status=false;
            _res.message=e.message;
            _res.result="";
        } 

        return _res;

    }
    async TodayFinanceDetails():Promise<any>
    {
        try{
            var query=`
            select A.*,B.* from borrowertrans as A join borrower as B on A.borrowerId=B.id
             where returndate1=curdate() or
            returndate2=curdate() or
            returndate3=curdate() or
            returndate4=curdate() or
            returndate5=curdate() or
            returndate6=curdate() or
            returndate7=curdate() or
            returndate8=curdate() or
            returndate9=curdate() or
            returndate10=curdate() or
            returndate11=curdate() or
            returndate12=curdate() `;

            var toadyOepning=`
            select sum(amount) as opening from borrowertrans
            where returndate1=curdate() or
           returndate2=curdate() or
           returndate3=curdate() or
           returndate4=curdate() or
           returndate5=curdate() or
           returndate6=curdate() or
           returndate7=curdate() or
           returndate8=curdate() or
           returndate9=curdate() or
           returndate10=curdate() or
           returndate11=curdate() or
           returndate12=curdate()`;
           var tdyClosing=`
           select sum(returnAmt) as closing from borrower_trans_return where returndate=curdate()`;
            const _manager=getManager();
            var _pendingData=await _manager.query(query);
            var _tdyOpening=await _manager.query(toadyOepning);
            var _todayClosing=await _manager.query(tdyClosing);
            let todayData={
                todayAllPending:_pendingData,
                todayOpening:_tdyOpening,
                todayclosing:_todayClosing

            };
            return todayData;

        }
        catch(e) 
        {
         var msg={
             msg:e.message,
             status:false
         };
         return msg;
        }
    }
    async assignLeadtoCollector(model:collectorlead):Promise<any>
    {
        try{
            model.createdOn=new Date();
            this._collectorLead.create(model); 
            this._collectorLead.save(model);
            var msg1={
                message:"Lead Assigned Successfully",
                status:true
            };
            return msg1;
        }
        catch(e){
            var msg={
                message:e.message,
                status:false

            };
            return msg;
        }
    }

    // async GetBorrowerTransactionHistory(model:TransactionStatusModel):Promise<any>
    // {
    //     if(model.transType=="cr" || model.transType=="Cr")
    //     {
    //         let records=await this._borrowerTrans.find({where:{borrowerid:model.id,transType:model.transType}});
    //         for(let i=0;i<records.length;i++)
    //         {
    //             let borrowerRecord=await this._borrowerRepo.findOne({where :{id:records[i].borrowerid}});
    //             records[i].mobile=borrowerRecord.mobile;
    //             records[i].name=borrowerRecord.name;
    //         }
    //         return records;
    //     }
    //     if(model.transType=="dr"||model.transType=="Dr")
    //     {
    //         let records=await this._borrowerTrans.find({where:{borrowerid:model.id,transType:model.transType}});
    //         for(let i=0;i<records.length;i++)
    //         {
    //             let borrowerRecord=await this._borrowerRepo.findOne({where :{id:records[i].borrowerid}});
    //             records[i].mobile=borrowerRecord.mobile;
    //             records[i].name=borrowerRecord.name;
    //         }
    //         return records;
    //     }
    // }

    // async GetTodayPendingCollection(id:number):Promise<any>
    // {
    //     var  records=await this._borrowerTrans.find({where:{transType:"cr"}});
    //     for(let i=0;i<records.length;i++)
    //         {
    //             let borrowerRecord=await this._borrowerRepo.findOne({where :{id:records[i].borrowerid}});
    //             records[i].mobile=borrowerRecord.mobile;
    //             records[i].name=borrowerRecord.name;
    //         }
    //     return records;
        
    // }

    async GetTransactionHistory():Promise<any>{
        const _manager=getManager();
        var query=`
                select amount,ReturnAmt,date_format(ReturnDate1,'%d-%m-%Y') as ReturnDate,'give'as TranType,B.name,B.mobile,B.id,B.designation from borrowertrans  as A join borrower as B on A.borrowerId=B.id
                union
                select returnAmt,ReturnAmt,date_format(ReturnDate,'%d-%m-%Y') as  ReturnDate,'receive' as TranType,B.name,B.mobile,B.id,B.designation from borrower_trans_return as A join borrower as B on A.borrowerId=B.id`;
       return _manager.query(query);
                
    }

    async GetTransHistoryPeriodically(model:periodicTransHistory):Promise<any>{
        const _manager=getManager();
        if(model.periodicType==0)
        {
           
            var query=`
            select amount,date_format(ReturnDate1,'%d-%m-%Y') as ReturnDate,'give'as TranType,B.name,B.mobile,B.id,B.designation, date_format(A.createdAt,'%d-%m-%Y %H:%i:%s') as createdAt from borrowertrans  as A join borrower as B on A.borrowerId=B.id where date_format(A.createdAt,'%Y')='${model.year}' and A.borrowerId=${model.userId}
            union
            select returnAmt,date_format(ReturnDate,'%d-%m-%Y') as  ReturnDate,'receive' as TranType,B.name,B.mobile,B.id,B.designation,date_format(A.createdAt,'%d-%m-%Y %H:%i:%s') as createdAt from borrower_trans_return as A join borrower as B on A.borrowerId=B.id where date_format(A.createdAt,'%Y')='${model.year}' and A.borrowerId=${model.userId}`;
          
          let data= await _manager.query(query);
        
            
              return {periodicData:Array(data).length>0?data:[data]};
        }
        if(model.periodicType==1)
        {
         
            var query=`
            select amount,date_format(ReturnDate1,'%d-%m-%Y') as ReturnDate,'give'as TranType,B.name,B.mobile,B.id,B.designation,date_format(A.createdAt,'%d-%m-%Y %H:%i:%s') as createdAt from borrowertrans  as A join borrower as B on A.borrowerId=B.id where date_format(A.createdAt,'%d-%m-%Y')>='${model.fromDate}' and date_format(A.createdAt,'%d-%m-%Y')<='${model.todate}' and A.borrowerId=${model.userId}
            union
            select returnAmt,date_format(ReturnDate,'%d-%m-%Y') as  ReturnDate,'receive' as TranType,B.name,B.mobile,B.id,B.designation,date_format(A.createdAt,'%d-%m-%Y %H:%i:%s') as createdAt from borrower_trans_return as A join borrower as B on A.borrowerId=B.id where date_format(A.createdAt,'%d-%m-%Y')>='${model.fromDate}' and date_format(A.createdAt,'%d-%m-%Y')<='${model.todate}' and A.borrowerId=${model.userId}
                  `;
            let data1=await  _manager.query(query);
            
            return {periodicData:Array(data1).length>0?data1:[data1]};
        }
    }

    async GetApproveDisapproveData(model:approveTrans):Promise<any>{
        const _manager=getManager();
        var query:string;
        if(model.role=="c")
        {
            //get disaaprove status data
            if(model.TranStaus==0)
            {
                query=`
                select A.*,B.name as BorrowerName,B.mobile borrowerMobile,B.addressLine1 as BorrowerAddress,A.IsTreasurerApproved,A.IsAdminApproved,c.name as collector,c.mobile as collectormobile from borrower_trans_return as A join borrower as B on A.borrowerId=B.Id join collector as c on A.RoleId=c.id where A.Role='c' and RoleId=${model.roleId} and IsTreasurerApproved=${model.TranStaus}`;
             var data=await _manager.query(query);    
            return {periodicData:Array(data).length>0?data:[data]};
            }
            //Get Approve data
            if(model.TranStaus==1)
            {
                query=`
                select A.*,B.name as BorrowerName,B.mobile borrowerMobile,B.addressLine1 as BorrowerAddress,A.IsTreasurerApproved,A.IsAdminApproved,c.name as collector,c.mobile as collectormobile from borrower_trans_return as A join borrower as B on A.borrowerId=B.Id join collector as c on A.RoleId=c.id where A.Role='c' and RoleId=${model.roleId} and IsTreasurerApproved=${model.TranStaus}`;
                var data=await _manager.query(query);    
                return {periodicData:Array(data).length>0?data:[data]};
            }
            
            //Get Backline data
            if(model.TranStaus==2)
            {
                query=`
                select A.*,B.name as BorrowerName,B.mobile borrowerMobile,B.addressLine1 as BorrowerAddress,A.IsTreasurerApproved,A.IsAdminApproved,c.name as collector,c.mobile as collectormobile from borrower_trans_return as A join borrower as B on A.borrowerId=B.Id join collector as c on A.RoleId=c.id where A.Role='c' and RoleId=${model.roleId} and IsTreasurerApproved=${model.TranStaus}`;
               
                var data=await _manager.query(query);    
                return {periodicData:Array(data).length>0?data:[data]};
            }
        }
        if(model.role=="t")
        {
            if(model.TranStaus==0)
            {
                if(parseInt(model.roleId)>0)
                {
                    query=`
                    select A.*,B.name as BorrowerName,B.mobile borrowerMobile,B.addressLine1 as BorrowerAddress,A.IsTreasurerApproved,A.IsAdminApproved,c.name as collector,c.mobile as collectormobile from borrower_trans_return as A join borrower as B on A.borrowerId=B.Id join collector as c on A.RoleId=c.id where RoleId=${model.roleId} and IsTreasurerApproved=${model.TranStaus}`;
               
                }
                if(parseInt(model.roleId)==0)
                {
                    query=`
                    select A.*,B.name as BorrowerName,B.mobile borrowerMobile,B.addressLine1 as BorrowerAddress,A.IsTreasurerApproved,A.IsAdminApproved,c.name as collector,c.mobile as collectormobile from borrower_trans_return as A join borrower as B on A.borrowerId=B.Id join collector as c on A.RoleId=c.id where   IsTreasurerApproved=${model.TranStaus}`;
               
                }
                var data=await _manager.query(query);    
            return {periodicData:Array(data).length>0?data:[data]};
            }
            //Get Approve data
            if(model.TranStaus==1)
            {
                if(parseInt(model.roleId)>0)
                {
                    query=`
                    select A.*,B.name as BorrowerName,B.mobile borrowerMobile,B.addressLine1 as BorrowerAddress,A.IsTreasurerApproved,A.IsAdminApproved,c.name as collector,c.mobile as collectormobile from borrower_trans_return as A join borrower as B on A.borrowerId=B.Id join collector as c on A.RoleId=c.id where RoleId=${model.roleId} and IsTreasurerApproved=${model.TranStaus}`;
               
                }
                if(parseInt(model.roleId)==0)
                {
                    query=`
                    select A.*,B.name as BorrowerName,B.mobile borrowerMobile,B.addressLine1 as BorrowerAddress,A.IsTreasurerApproved,A.IsAdminApproved,c.name as collector,c.mobile as collectormobile from borrower_trans_return as A join borrower as B on A.borrowerId=B.Id join collector as c on A.RoleId=c.id where   IsTreasurerApproved=${model.TranStaus}`;
               
                }
                var data=await _manager.query(query);    
                return {periodicData:Array(data).length>0?data:[data]};
            }
            
            //Get Backline data
            if(model.TranStaus==2)
            {
                if(parseInt(model.roleId)>0)
                {
                    query=`
                    select A.*,B.name as BorrowerName,B.mobile borrowerMobile,B.addressLine1 as BorrowerAddress,A.IsTreasurerApproved,A.IsAdminApproved,c.name as collector,c.mobile as collectormobile from borrower_trans_return as A join borrower as B on A.borrowerId=B.Id join collector as c on A.RoleId=c.id where RoleId=${model.roleId} and IsTreasurerApproved=${model.TranStaus}`;
               
                }
                if(parseInt(model.roleId)==0)
                {
                    query=`
                    select A.*,B.name as BorrowerName,B.mobile borrowerMobile,B.addressLine1 as BorrowerAddress,A.IsTreasurerApproved,A.IsAdminApproved,c.name as collector,c.mobile as collectormobile from borrower_trans_return as A join borrower as B on A.borrowerId=B.Id join collector as c on A.RoleId=c.id where   IsTreasurerApproved=${model.TranStaus}`;
               
                }
                var data=await _manager.query(query);    
                return {periodicData:Array(data).length>0?data:[data]};
            }
        }
        if(model.role=="a")
        {
            if(model.TranStaus==0)
            {
                if(parseInt(model.roleId)>0)
                {
                    query=`
                    select A.*,B.name as BorrowerName,B.mobile borrowerMobile,B.addressLine1 as BorrowerAddress,A.IsTreasurerApproved,A.IsAdminApproved,c.name as collector,c.mobile as collectormobile from borrower_trans_return as A join borrower as B on A.borrowerId=B.Id join collector as c on A.RoleId=c.id where RoleId=${model.roleId} and IsAdminApproved=${model.TranStaus}`;
               
                }
                if(parseInt(model.roleId)==0)
                {
                    query=`
                    select A.*,B.name as BorrowerName,B.mobile borrowerMobile,B.addressLine1 as BorrowerAddress,A.IsTreasurerApproved,A.IsAdminApproved,c.name as collector,c.mobile as collectormobile from borrower_trans_return as A join borrower as B on A.borrowerId=B.Id join collector as c on A.RoleId=c.id where   IsAdminApproved=${model.TranStaus}`;
               
                }
             
            var data=await _manager.query(query);    
            return {periodicData:Array(data).length>0?data:[data]};
            }
            //Get Approve data
            if(model.TranStaus==1)
            {
                if(parseInt(model.roleId)>0)
                {
                    query=`
                    select A.*,B.name as BorrowerName,B.mobile borrowerMobile,B.addressLine1 as BorrowerAddress,A.IsTreasurerApproved,A.IsAdminApproved,c.name as collector,c.mobile as collectormobile from borrower_trans_return as A join borrower as B on A.borrowerId=B.Id join collector as c on A.RoleId=c.id where RoleId=${model.roleId} and IsAdminApproved=${model.TranStaus}`;
               
                }
                if(parseInt(model.roleId)==0)
                {
                    query=`
                    select A.*,B.name as BorrowerName,B.mobile borrowerMobile,B.addressLine1 as BorrowerAddress,A.IsTreasurerApproved,A.IsAdminApproved,c.name as collector,c.mobile as collectormobile from borrower_trans_return as A join borrower as B on A.borrowerId=B.Id join collector as c on A.RoleId=c.id where   IsAdminApproved=${model.TranStaus}`;
               
                }
                var data=await _manager.query(query);    
                return {periodicData:Array(data).length>0?data:[data]};
            }
            if(model.TranStaus==2)
            {
                if(parseInt(model.roleId)>0)
                {
                    query=`
                    select A.*,B.name as BorrowerName,B.mobile borrowerMobile,B.addressLine1 as BorrowerAddress,A.IsTreasurerApproved,A.IsAdminApproved,c.name as collector,c.mobile as collectormobile from borrower_trans_return as A join borrower as B on A.borrowerId=B.Id join collector as c on A.RoleId=c.id where RoleId=${model.roleId} and IsAdminApproved=${model.TranStaus}`;
               
                }
                if(parseInt(model.roleId)==0)
                {
                    query=`
                    select A.*,B.name as BorrowerName,B.mobile borrowerMobile,B.addressLine1 as BorrowerAddress,A.IsTreasurerApproved,A.IsAdminApproved,c.name as collector,c.mobile as collectormobile from borrower_trans_return as A join borrower as B on A.borrowerId=B.Id join collector as c on A.RoleId=c.id where   IsAdminApproved=${model.TranStaus}`;
               
                }
                var data=await _manager.query(query);    
                return {periodicData:Array(data).length>0?data:[data]};
            }
        }
        
        
                
    }

    async UpdateOpeningBal(model:UpdateBalModel):Promise<any>
    {
        const _manager=getManager();
        var query:any;
        try{
            query=`update opening_bal set amount=${model.amount},updatedAt=curdate(),remark='${model.remark}'`;
            

            let data=await _manager.query(query);
            query='select * from opening_bal';
            data=await _manager.query(query);
            
            return {balData:Array(data).length>0?data:[data]}

        }
        catch(e)
        {
           return({
               error:e.message
           });
        }
    }

    async ApproveTransaction(model:ApproveTrans):Promise<any>
    {
        
        const _manager=getManager();
        var message:any;
        var query:any;
        //0 for admin approval 
        if(model.roleid==0)
        {
            query=`update borrower_trans_return set IsAdminApproved=${model.transStatus} where Id=${model.transId} and borrowerid=${model.borrowerId}`;
            message="Admin Approved Transaction.";
        }
        //1 for treasurer approval
        if(model.roleid==1)
        {
            query=`update borrower_trans_return set IsTreasurerApproved=${model.transStatus} where Id=${model.transId} and borrowerid=${model.borrowerId}`;
            message="Treasurer Approved the Transaction";
        }
        let data=await _manager.query(query);
        return (message);
        
    }

    async GetBalance():Promise<any> 
    {
        
        const _manager=getManager();
        let query=`select 
     amount-(select sum(amount) from borrowertrans)+Ifnull((select sum(returnAmt) from borrower_trans_return where IsAdminApproved=1),0) as Opening,
     (select sum(amount) from borrowertrans) as Closing
      from opening_bal `;
         var data=await _manager.query(query);
         return data;

    }
    
}
