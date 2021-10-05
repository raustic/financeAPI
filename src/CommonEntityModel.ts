import { ApiProperty } from "@nestjs/swagger";

export class CommonEntityModel{
    @ApiProperty()
    id:number
    @ApiProperty()
    activeStatus:number
}