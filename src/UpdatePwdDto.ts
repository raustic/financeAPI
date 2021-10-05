import { ApiProperty } from "@nestjs/swagger";

export class UpdatePasswordDTO{
    @ApiProperty()
    mobile:string;
    @ApiProperty()
    currentPwd:string
    @ApiProperty()
    newPwd:string
    //note 0:Admin 1:Collector 2:Treasures
    @ApiProperty()
    UserType:number
    //1 for password update by admin
    @ApiProperty()
    IsPasswordChangedByAdmin:number
}