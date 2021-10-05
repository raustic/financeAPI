import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class lender{
    @ApiProperty()
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id:number
    @ApiProperty()
    @Column()
    name:string
    @ApiProperty()
    @Column({unique:true})
    mobile:string
    @ApiProperty()
    @Column()
    addressLine1:string
    @ApiProperty()
    @Column()
    addresslLine2:string 
    @ApiProperty()
    @Column()
    Zip:string
    @ApiProperty()
    @Column()
    State:string
    @ApiProperty()
    @Column()
    CreatedAt:Date
    @ApiProperty()
    @Column()
    CreatedBy:string
    @ApiProperty()
    @Column()
    isActive:number
    @ApiProperty()
    @Column()
    Designation:string  

}