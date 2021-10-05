import { ApiProperty } from "@nestjs/swagger"

export class ApproveTrans{
    @ApiProperty()
    roleid:number
    @ApiProperty()
    transId:number
    @ApiProperty()
    borrowerId:number 
    @ApiProperty()
    transStatus:number   
}