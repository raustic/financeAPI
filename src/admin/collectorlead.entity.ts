import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class collectorlead{
@PrimaryGeneratedColumn()
id:number
@Column()
collectorId:number
@Column()
borrowerid:number
@Column()
amt:number
@Column()
ReturnDate:Date
@Column()
createdOn:Date
@Column()
createdBy:string
}