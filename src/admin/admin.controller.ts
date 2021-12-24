import { Body, Param, Post, Query, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { get } from 'http';
import { diskStorage } from 'multer';

import { borrowerTransQueryModel } from 'src/borrowerTransQueryModel';
import { CommonEntityModel } from 'src/CommonEntityModel';
import { TransactionStatusModel } from 'src/TransactionStatusModel';
import { BeforeUpdate, Entity } from 'typeorm';
import { AdminService } from './admin/admin.service';
import { borrower } from './borrower.entity';
import { borrowertrans } from './borrowertrans.entity';
import { borrowerTransReturn } from './borrowerTransReturn.entity';
import { collector } from './collector.entity';
import { collectorlead } from './collectorlead.entity';
import { lender } from './lender.entity';
import { lendertrans } from './lendertrans.entity';
import { TransactionService } from './transaction/transaction.service';
import { Treasurer } from './treasurer.entity';
import fs from 'fs';
import { image } from 'src/users/image';
import { imageUploadDto } from 'src/imageUploadDto';
import { periodicTransHistory } from 'src/periodicTransHistory';
import { approveTrans } from './transaction/ApproveDataModel';
import { ApproveTrans } from './transaction/ApproveTransModel';
import { UpdateBalModel } from 'src/updateOpeningBalModel';
import { updateDateModel } from 'src/updateDateModel';
import { query } from 'express';


@Controller('admin')
export class AdminController {
    constructor(private _adminService:AdminService,
        private _transService:TransactionService){

    }

    //Lender Request Start Here
    
    // @Get('lenders/:id')
    // lenders(@Param('id')id:number):Promise<lender[]>{
        
    //     return this._adminService.GetLenders(id);
    // }
    // @Get('DeactivateLenders')
    // async DeactivateLenders():Promise<any>{
    //     return this.DeactivateLenders();
    // } 
    // @Post('createlender')
    
    // CreateLender(@Body()entity:lender):Promise<any>
    // {
    //     entity.CreatedAt=new Date();
    //     entity.isActive=1;
    //     var msg=this._adminService.CreateLender(entity);
    //     return msg;  
    // }
    // @Post('updatelender')
    // UpdateLender(@Body()entity:lender):Promise<any>
    // {

    //     var  msg=this._adminService.UpdateLender(entity);
    //     return msg;
    // }

    // @Post('DeleteUser')
    DeleteUser(@Body()entity:CommonEntityModel)
    {
        var msg=this._adminService.DeleteLender(entity);
        return msg;
    }

    //Lender Request Ends Here
    
    
    //borrowers Request Start Here
    
    @Get('borrowers/:id/:order')
    borrowers(@Param('id')id:number,@Param('order') order:string):Promise<borrower[]>{
        return this._adminService.GetBorrowers(id,order);
    }
    
    @Post('createborrower')
    
    CreateBorrower(@Body()entity:borrower):Promise<any>
    {
        entity.CreatedAt=new Date();
        entity.IsActive=1;
        var msg=this._adminService.CreateBorrower(entity);
        return msg;  
    }
    @Post('updateborrower')
    UpdateBorrower(@Body()entity:borrower):Promise<any>
    {
        var  msg=this._adminService.UpdateBorrower(entity);
        return msg;
    }

    @Post('Deleteborrower')
    DeleteBorrower(@Body()entity:CommonEntityModel)
    {
        var msg=this._adminService.DeleteBorrower(entity);
        return msg;
    }

    //Lender Request Ends Here


    //Collector API Strat Here
    
    @Get('collectors/:id')
    collectors(@Param('id')id:number):Promise<collector[]>{
        return this._adminService.GetCollectors(id);
    }
    
    @Post('createcollector')
    
    CreateCollector(@Body()entity:collector):Promise<any>
    {
        entity.CreatedAt=new Date();
        entity.IsActive=1;
        var msg=this._adminService.CreateCollector(entity);
        return msg;  
    }
    @Post('updatecollector')
    UpdateCollector(@Body()entity:collector):Promise<any>
    {
        var  msg=this._adminService.UpdateCollector(entity);
        return msg;
    }

    @Post('DeleteCollector')
    DeleteCollector(@Body()entity:CommonEntityModel)
    {
        var msg=this._adminService.DeleteCollector(entity);
        return msg;
    }
    //Collector API Ends Here

    //Transaction API Start Here
    // @Get('lenderTransactions/:id')
    // GetLenderTransactions(@Param('id') id:number):Promise<lendertrans[]>
    // {
    //     return this._transService.GetLenderTransactions(id);
    // }
    // @Post('MakeLenderTrans')
    // MakeLenderTransactions(@Body()entity:lendertrans):Promise<any>
    // {
    //     var _res=this._transService.CreateLenderTrans(entity);
    //     return _res;
    // }
    // @Post('DeleteLenderTrans')
    // DeleteLenderTrans(@Body()entity:CommonEntityModel)
    // {
    //     var  _res=this._transService.DeleteLenderTrans(entity);
    //     return _res;
    // }
    @Get('borrowerDataTras')
    getdate()
    {
        return this._transService.GetPendingPayment(2);
    }

    
    @Post('borrowerTransactions')
    GetborrowerTransactions(@Body()entity:borrowerTransQueryModel):Promise<borrowertrans[]>
    {
        return this._transService.GetBorrowerTransactions(entity);
    }
    @Post('GiveborrowerTrans')
    MakeborrowerTransactions(@Query()entity:borrowertrans):Promise<any>
    {
        
        var _res=this._transService.CreateBorrowerTrans(entity);
        return _res;
    }
    @Post('ReceiveborrowerTrans')
    ReceiveBorrowerTrans(@Body()entity:borrowerTransReturn)
    {
        var _res=this._transService.CreateReturnBorrowerTrans(entity);
        return _res;
    }
    @Post('DeleteBorrowerTrans')
    DeleteborrowerTrans(@Body()entity:CommonEntityModel)
    {
        var  _res=this._transService.DeleteBorrowerTrans(entity);
        return _res;
    }
    // @Get('BusinessFlow')
    // GetBusinessFlowStatus():Promise<any>
    // {
    //     var  _res=this._transService.GetTransactionTotal();
    //     return _res;
    // }    
    
    //Trsnaction API Ends Here

    //Active-Deactivate Borrower ,Lender,and Collector 
    @Post('ActiveDeactivateBorrower')
    ActiveDeactivateBorrower(@Body()cto:CommonEntityModel):Promise<any>
    {
        var res=this._adminService.ActiveDeactivateBorrower(cto);
        return res;
    }
    @Post('ActiveDeactiveLender')
    ActiveDeactiveLender(@Body()cto:CommonEntityModel):Promise<any>
    {
        var res=this._adminService.ActiveDeactivateLender(cto);
        return res;
    }
    @Post('ActiveDeactiveCollector')
    ActiveDeactiveCollector(@Body()cto:CommonEntityModel)
    {
        var res=this._adminService.ActiveDeactivateCollector(cto);
        return res;
    }

    //Treasueres Profile Created
    @Get('GetTreasureres/:id')
    async GetTreasureres(@Param('id')id:number):Promise<any>
    {
        return this._adminService.GetTreasuerers(id);
    }
    
    @Post('CreateTreasurer')
    async CreateTreasurer(@Body()dto:Treasurer):Promise<any>
    {
        dto.CreatedAt=new Date();
        dto.IsActive=1;
     return this._adminService.CreateTreasurer(dto);
    }
    @Post('UpdateTreasurer')
    async UpdateTreasurer(@Body()dto:Treasurer):Promise<any>
    {
        return this._adminService.UpdateTreasures(dto);
    }
    @Post('ActiveNDeactiveTreasurer')
    async ActiveDeactiveTreasurer(@Body()dto:CommonEntityModel):Promise<any>
    {
        return this._adminService.ActivateNDeactivateTeasures(dto);
    }
    @Get('TodayPendingDetails')
    async TodaypendingDetails()
    {
       return this._transService.TodayFinanceDetails();
    }
    @Post('AsignLead')
    async AssignLeadToCollector(@Body()model:collectorlead)
    {
        return this._transService.assignLeadtoCollector(model);
        
    }

    @Get('TransactionHistory')
    async GetTransactionHistory():Promise<any>
    {
        return this._transService.GetTransactionHistory();
    }
    // @Post('saveImages')
    
    // async SaveImages(@Body()img:image ):Promise<any>
    // {
        
    //     var imgpath=require('path');

    //     var base64ToImage = require('base64-to-image');
    //     var base64Str = img.image;
        
    //     var path ='./public/';
    //     var optionalObj = {'fileName': img.userid, 'type':'png'};

    //     base64ToImage(base64Str,path,optionalObj); 
        
    //     var imageInfo = base64ToImage(base64Str,path,optionalObj);
    //     console.log("Image saved Successfully"+JSON.stringify(imageInfo));
    //      var imagesrc='http://localhost:3000/files12.png';  

         
              
    //      return imagesrc;     

    // }

    @Post('SaveImages')
    async UploadImages(@Body()dto:imageUploadDto)
    {
        var res=this._adminService.SaveImage(dto);
        return res;
    }

    // @Get('GetTreasureres/:id')
    // async GetTreasureres(@Param('id')id:number):Promise<any>
    // {
    //     return this._adminService.GetTreasuerers(id);
    // }
    // @Get('PerTrs/:{userId}/:{ptype}/:{year}/:{from}/:{to}')
    @Post('GetPeriodicTransaction')
    async PeriodicTransaction(@Body() dto:periodicTransHistory)
        {
        try{

           

        var res=this._transService.GetTransHistoryPeriodically(dto);
        return res;
        }
        catch(ex)
        {
            return ex.message;
        }
    }
    
    @Post('GetAppDisAppTrans') 
    async GetApproveDisApproveTrans(@Body() model:approveTrans) 
    {
        try{

        var res=this._transService.GetApproveDisapproveData(model);
            return res;
            }
            catch(ex)
            {
                return ex.message;
            }
    }
    @Post('ApproveTrans')
    async ApproveTrnsaction(@Body()model:ApproveTrans)
    {
        var res=this._transService.ApproveTransaction(model);
        return res;

    } 

    @Post('UpdateAdminBal')
    async UpdateOpeningBal(@Body()model:UpdateBalModel)
    {
        var res= this._transService.UpdateOpeningBal(model);
        return res;
    }
    @Get('GetAdminBalance')
    async GetBalance()
    {
        var res=this._transService.GetBalance();
        return res; 
    }

    
    @Get('/figCOnvert/:fig')
    figToWords(@Param('fig')fig:number):Promise<borrower[]>{
        return this._adminService.ConvertWords(fig);
    }
    
    
    
    
    @Get('/cases/:statusOrId')
    Getcases(@Param('statusOrId')statusOrId:number):Promise<borrower[]>{
        return this._transService.GetAllCases(statusOrId);
    }
    @Get('/casesDates/:caseId')
    CaseDates(@Param('caseId')caseId:string):Promise<borrower[]>{
        return this._transService.caseReturnDate(caseId);
    }
    @Post('/UpdatdeCaseDate')
    UpdateCaseDates(@Body()data:updateDateModel)
    {
        return this._transService.updateReturnDates(data);
    }

    @Get('/DeleteCase/:caseId')
    DeleteCase(@Param('caseId')caseId:string):Promise<any>
    {
        return this._transService.deleteCase(caseId);
    }
    

}

