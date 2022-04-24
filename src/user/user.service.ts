import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { generateFaliureResponse, generateSuccessResponse, generateValidationResponse } from "utils";
import { UserDto } from "./dto/index";

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async create(dto: UserDto) {
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    name: dto.name,
                    amount: dto.amount
                },
            })
            return generateSuccessResponse("userservice.create","User created successfully", dto);
        } catch (error) {
            return generateFaliureResponse("userservice.create","Something went wrong", error)
        }

    }

    async update(dto: UserDto, email: string) {
        try {
            const user = await this.fetchUser(email);
            if (!user.data) {
                return generateValidationResponse("userservice.update","Email not found", user.error)
            }
            const updatedUser = await this.prisma.user.update({
                where: { id: user.data.id },
                data: { ...dto }
            })
            return generateSuccessResponse("userservice.update","updated successfuly", updatedUser)
        } catch (error) {
            return generateFaliureResponse("userservice.update","Something went wrong", error)
        }
    }

    async delete(email: string) {
        try {
            const user = await this.fetchUser(email);
            if (!user.data) {
                return generateValidationResponse("userservice.delete","Email not found", user.error)
            }
            const deteledUser = await this.prisma.user.delete({
                where: {
                    id: user.data.id
                }
            })

            return generateSuccessResponse("userservice.delete","User deleted successfuly", deteledUser)
        } catch (error) {
            return generateFaliureResponse("userservice.delete","Something went wrong", error)
        }
    }

    async fetchUser(email: string) {
        try {
            const user = await this.prisma.user.findFirst({
                where: {
                    email
                }
            })

            return generateSuccessResponse("userservice.fetchUser","User fetched successfully", user)
        } catch (error) {
            return generateFaliureResponse("userservice.fetchUser","Something went wrong", error)
        }

    }

    async fetchUsersList() {
        try {
            const users = await this.prisma.user.findMany({})
            return generateSuccessResponse("userservice.fetchUsersList","User(s) fetched successfully", users)
        } catch (error) {
            return generateFaliureResponse("userservice.fetchUsersList","Something went wrong", error)
        }
    }
}