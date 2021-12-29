import { ApiProperty } from "@nestjs/swagger"

export class imageUploadDto{
    @ApiProperty()
    image:string
    @ApiProperty()
    mobile:string
    @ApiProperty()
    type:string
}