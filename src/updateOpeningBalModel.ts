import { ApiProperty } from "@nestjs/swagger"

export class UpdateBalModel{
@ApiProperty()
amount:number
@ApiProperty()
remark:string
}