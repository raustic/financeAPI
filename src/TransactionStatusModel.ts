import { ApiProperty } from "@nestjs/swagger"

export class TransactionStatusModel{
    @ApiProperty()
    id:number
    @ApiProperty()
    transType:string
}