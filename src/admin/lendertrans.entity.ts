import { ApiProperty } from "@nestjs/swagger"
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class lendertrans{
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id:number
    @Column()
    @ApiProperty()
    lenderid:number
    @Column()
    @ApiProperty()
    amount:number
    @Column()
    @ApiProperty()
    lendedOn:Date
    @ApiProperty()
    @Column()
    transType:string
    @Column()
    @ApiProperty()
    Remark:string
    @Column()
    @ApiProperty()
    createdAt:Date
    @Column()
    @ApiProperty()
    createdBy:string
   
    
}