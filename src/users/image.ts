import { ApiProperty } from "@nestjs/swagger"

export class image{
    @ApiProperty()
    image:string
    @ApiProperty()
    userid:number
}