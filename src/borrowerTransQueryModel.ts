import { ApiProperty } from "@nestjs/swagger"

export class borrowerTransQueryModel{
    @ApiProperty()
    borrowerId:number
    @ApiProperty()
    transactionId:number    
}