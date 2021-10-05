import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class OpeningBal{
@ApiProperty()
@PrimaryColumn()
@PrimaryGeneratedColumn()

id:number
@ApiProperty()
@Column()
amount:number
@ApiProperty()
@Column()
remark:string
@ApiProperty()
@Column()
createdAt:Date
@ApiProperty()
@Column()
updatedAt:Date
}