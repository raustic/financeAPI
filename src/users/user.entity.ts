import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  firstName: string;
  
@ApiProperty()
  @Column()
  lastName: string;
  
@ApiProperty()
  @Column()
  email:string  
  
@ApiProperty()
  @Column()
  mobile:string
  
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
  States:string
 
@ApiProperty()
  @Column()
  password:string

  @ApiProperty()
  @Column({ default: true })
  isActive: boolean;
}