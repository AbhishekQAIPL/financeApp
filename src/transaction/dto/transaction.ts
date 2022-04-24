import { IsEmail, IsNotEmpty, IsNumber } from "class-validator";

export class AmountDto {
    @IsNumber()
    @IsNotEmpty()
    amount: number
}

export class TransferFundDto {
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsEmail()
    @IsNotEmpty()
    to: string
}