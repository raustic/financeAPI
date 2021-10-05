import { ApiProperty } from "@nestjs/swagger"
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class collector{
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id:number
    @ApiProperty()
    @Column()
    name:string
    @ApiProperty()
    @Column()
    mobile:string
    @ApiProperty()
    @Column()
    watsappNumber:string
    @ApiProperty()
    @Column()
    addressLine1:string
    @ApiProperty()
    @Column()
    addressLine2:string
    @ApiProperty()
    @Column()
    Zip:string
    @ApiProperty()
    @Column()
    State:string
    @ApiProperty()
    @Column()
    city:string
    @ApiProperty()
    @Column()
    CreatedBy:string
    @ApiProperty()
    @Column()
    CreatedAt:Date
    @ApiProperty()
    @Column()
    IsActive:number
    @ApiProperty()
    @Column()
    Designation:string  
    @Column()
    Password:string
}