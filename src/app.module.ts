import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { PrismaModule } from './prisma/prisma.module';
import { TransactionModule } from './transaction/transaction.module';


@Module({
  imports: [UserModule, PrismaModule, TransactionModule],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
