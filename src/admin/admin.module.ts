import { Module } from '@nestjs/common';
import { AdminService } from './admin/admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { lender } from './lender.entity';
import { borrower } from './borrower.entity';
import { collector } from './collector.entity';
import { TransactionService } from './transaction/transaction.service';
import { borrowertrans } from './borrowertrans.entity';
import { lendertrans } from './lendertrans.entity';
import { Treasurer } from './treasurer.entity';
import { borrowerTransReturn } from './borrowerTransReturn.entity';
import { collectorlead } from './collectorlead.entity';
import { OpeningBal } from './transaction/openingBal.entity';

@Module({
  imports:[TypeOrmModule.forFeature([lender,borrower,collector,collectorlead,borrowertrans,lendertrans,Treasurer,borrowerTransReturn,OpeningBal])],
  providers: [AdminService, TransactionService],
  controllers: [AdminController]
})
export class AdminModule {}
