import { ApiProperty } from "@nestjs/swagger"

export class approveTrans
{
@ApiProperty()
role:string

@ApiProperty()
roleId:string

@ApiProperty()
TranStaus:number
}