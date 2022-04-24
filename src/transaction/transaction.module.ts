import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [TransactionService, UserService],
  controllers: [TransactionController]
})
export class TransactionModule {}
