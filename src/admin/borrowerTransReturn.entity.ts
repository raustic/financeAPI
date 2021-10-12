import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import { ApiProperty } from "@nestjs/swagger"
import { Exclude } from 'class-transformer';

@Entity()
export class borrowerTransReturn{
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id:number
    @Column()
    @ApiProperty()
    tranId:number
    @Column()
    @ApiProperty()
    borrowerid:number
    
    @ApiProperty()
    @Column()
    returnAmt:number
    
    @Column()
    @ApiProperty()
    ReturnDate:string
    
    @ApiProperty({
        description:"Input return Type like One Time Two Time"
    })
    ReturnType:string
    @Column()
    @ApiProperty()
    Remark:string
    @Column()
    @ApiProperty()
    createdAt:Date
    @Column()
    @ApiProperty()
    createdBy:string
    @Exclude()
    giveAmt:number
    @Exclude()
    ReturnAmt:number
    @Column()
    @ApiProperty()
    Role:string
    @Column()
    @ApiProperty()
    RoleId:number
    @Column()
    @ApiProperty()
    IsColtApproved:number
   // @Column()
   // IsCollectorApproved:number
    @ApiProperty()
    @Column()
    IsTreasurerApproved:number
    @Column()
    IsAdminApproved:number
    @Column()
    @ApiProperty()
    paymentMode:string
    
   
    
}