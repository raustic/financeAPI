import { ApiProperty } from "@nestjs/swagger";

export class updateDateModel{
    @ApiProperty()
    caseId:string
    @ApiProperty()
    id:number
    @ApiProperty()
    returnDate:Date
    @ApiProperty()
    returnAmt:number

}