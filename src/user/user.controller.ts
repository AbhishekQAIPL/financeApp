import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { UserDto } from "./dto/user.dto";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {
    constructor(private userService : UserService){}

    @Post('/')
    create(@Body() dto: UserDto  ){        
        return this.userService.create(dto)
    }

    @Patch('/:email')
    update(@Body() dto: any, @Param() param: any){
        return this.userService.update(dto, param.email)
    }

    @Delete('/:email')
    delete(@Param() param: any){
        return this.userService.delete(param.email)
    }

    @Get('/:email')
    fetch(@Param() param: any){
        return this.userService.fetchUser(param.email)
    }

    @Get('/')
    fetchUserList(){
        return this.userService.fetchUsersList()
    }
}