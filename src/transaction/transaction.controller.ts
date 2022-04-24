import { Body, Controller, Param, Post } from '@nestjs/common';
import { AmountDto, TransferFundDto } from './dto/index';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
    constructor(private transactionService: TransactionService) { }

    @Post('/deposite/:email')
    deposite(@Body() dto: AmountDto, @Param() param: any) {
        return this.transactionService.deposite(param.email, dto);
    }

    @Post('/withdraw/:email')
    withdraw(@Body() dto: AmountDto, @Param() param: any) {
        return this.transactionService.withdraw(param.email, dto);
    }

    @Post('/:email')
    transferFund(@Body() dto: TransferFundDto, @Param() param: any) {
        return this.transactionService.transferFunds(param.email, dto)
    }

}
