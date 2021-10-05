import {  ApiProperty } from "@nestjs/swagger";

export class periodicTransHistory{
    @ApiProperty()
    userId:number
    @ApiProperty()
    //0 for year 1 for query date
    periodicType:number
    @ApiProperty()
    year:string
    @ApiProperty()
    fromDate:string
    @ApiProperty()
    todate:string



}