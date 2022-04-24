import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { generateFaliureResponse, generateSuccessResponse, generateUnAuthorizeResponse, generateValidationResponse } from 'utils';
import { AmountDto, TransferFundDto } from './dto';

@Injectable()
export class TransactionService {
    constructor(private prisma: PrismaService, private userService: UserService) { }

    async deposite(email: string, dto: AmountDto) {
        try {
            const user = await this.userService.fetchUser(email);
            if (!user.data) {
                return generateUnAuthorizeResponse("TransactionService.deposite");
            }
            const updatedAmount = user.data.amount + dto.amount
            const updateAmount = await this.prisma.user.update({
                where: { id: user.data.id },
                data: { amount: updatedAmount }
            })
            return generateSuccessResponse("TransactionService.deposite", "Amount added successfully", updateAmount)

        } catch (error) {
            return generateFaliureResponse("TransactionService.deposite", "Sommething went wrong", error)
        }
    }

    async withdraw(email: string, dto: AmountDto) {
        try {
            const user = await this.userService.fetchUser(email);
            if (!user.data) {
                return generateUnAuthorizeResponse("TransactionService.withdraw");
            }
            const updatedAmount = user.data.amount - dto.amount;
            if (updatedAmount < 0) {
                return generateValidationResponse("TransactionService.withdraw", "Insufficient Amount", { currentAmount: user.data.amount, withdrawRequest: dto.amount })
            }
            const updateAmount = await this.prisma.user.update({
                where: { id: user.data.id },
                data: { amount: updatedAmount }
            })
            return generateSuccessResponse("TransactionService.withdraw", "Withdrawal Complete", updateAmount)

        } catch (error) {
            return generateFaliureResponse("TransactionService.withdraw", "Sommething went wrong", error)
        }
    }

    async transferFunds(email: string, dto: TransferFundDto) {
        try {
            const user = await this.userService.fetchUser(email);
            if (!user.data) {
                return generateUnAuthorizeResponse("TransactionService.transferFunds");
            }

            const recipient = await this.userService.fetchUser(dto.to);
            if (!recipient.data) {
                return generateValidationResponse("TransactionService.transferFunds", "Invalid Recipient details", `${dto.to} is not a valid user`);
            }

            const comission = dto.amount * parseFloat(process.env.COMISSION);
            const totalDeducatableAmount = user.data.amount + (dto.amount * 1.02);


            // user
            const updateUserAmount = await this.withdraw(email, { amount: totalDeducatableAmount })
            if (!updateUserAmount.data || updateUserAmount.error || updateUserAmount?.data.amount < user.data.amount) {
                throw "Transaction failed"
            }
            const updateRecipentAmount = await this.deposite(dto.to, { amount: dto.amount })
            if (!updateRecipentAmount.data || updateRecipentAmount.error || updateRecipentAmount?.data.amount < user.data.amount) {
                const updateRecipentAmount = await this.deposite(email, { amount: totalDeducatableAmount })
                throw "Transaction failed at recipent end"
            }

            const updateAdminAmount = await this.deposite(process.env.ADMIN_EMAIL, { amount: comission })

            const recipt = {
                from: email,
                to: dto.to,
                amount_transferred: dto.amount,
                fees: comission,
                balance_amount: updateUserAmount.data.amount
            }

            return generateSuccessResponse("TransactionService.transferFunds", "Transaction Complete", recipt)

        } catch (error) {
            return generateFaliureResponse("TransactionService.transferFunds", "Sommething went wrong", error)
        }
    }
}
