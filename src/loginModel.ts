import { ApiProperty } from "@nestjs/swagger"

export class LoginModel{
    @ApiProperty()
    userName:string
    @ApiProperty()
    pwd:string
    ///0: Admin,1:Collector and 2 : Treasurer
    @ApiProperty()
    role:number
}