import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import { ApiProperty } from "@nestjs/swagger"
import { Exclude } from 'class-transformer';
import { Transform } from "stream";

@Entity()
export class borrowertrans{
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id:number
    @Column()
    @ApiProperty({
        description:'Borrower Id'
    })
    borrowerid:number
    @Column()
    @ApiProperty()
    amount:number
    @ApiProperty()
    @Column()
    returnAmt:number
    @Column()
    @ApiProperty()
    term:string
    @ApiProperty()
    @Column()
    terminDays:number
    @Column()
    returnDate:Date
    // @Column()
    // @ApiProperty()
    // PayingDate:string
    // @Column()
    // @ApiProperty()
    // ReturnDate1:string
    // @Column()
    // @ApiProperty()
    // ReturnDate2:string  
    // @Column()
    // @ApiProperty()
    // ReturnDate3?:string
    // @Column()
    // @ApiProperty()
    // ReturnDate4?:string
    // @Column()
    // @ApiProperty()
    // ReturnDate5?:string
    // @Column()
    // @ApiProperty()
    // ReturnDate6?:string
    // @Column()
    // @ApiProperty()
    // ReturnDate7?:string
    // @ApiProperty()
    // @Column()
    // ReturnDate8?:string
    // @Column()
    // @ApiProperty()
    // ReturnDate9?:string
    // @Column()
    // @ApiProperty()
    // ReturnDate10?:string
    // @Column()
    // @ApiProperty()
    // ReturnDate11?:string
    // @Column()
    // @ApiProperty()
    // ReturnDate12?:string
   // @Column()
   // @ApiProperty({
     //   description:"Input return Type like One Time Two Time"
    //})
    //ReturnType:string
    //@ApiProperty()
    //@Column()
    //transType:string
    @Column()
    @ApiProperty()
    Remark:string
    @Column()
    @ApiProperty()
    createdAt:Date
    @Column()
    @ApiProperty()
    createdBy:string
    @Column()
    @ApiProperty()
    Partner1Mobile:string
    @Column()
    @ApiProperty()
    Partner1Name:string
    @Column()
    @ApiProperty()
    Partner1Amount:string
    @Column()
    @ApiProperty()
    Partner1PerOrRate:string
    @ApiProperty()
    Partner2Mobile:string
    @Column()
    @ApiProperty()
    Partner2Name:string
    @Column()
    @ApiProperty()
    Partner2Amount:string
    @Column()
    @ApiProperty()
    Partner2PerOrRate:string
    @ApiProperty()
    Partner3Mobile:string
    @Column()
    @ApiProperty()
    Partner3Name:string
    @Column()
    @ApiProperty()
    Partner3Amount:string
    @Column()
    @ApiProperty()
    Partner3PerOrRate:string
    @ApiProperty()
    Partner4Mobile:string
    @Column()
    @ApiProperty()
    Partner4Name:string
    @Column()
    @ApiProperty()
    Partner4Amount:string
    @Column()
    @ApiProperty()
    Partner4PerOrRate:string
    @ApiProperty()
    Partner5Mobile:string
    @Column()
    @ApiProperty()
    Partner5Name:string
    @Column()
    @ApiProperty()
    Partner5Amount:string
    @Column()
    @ApiProperty()
    Partner5PerOrRate:string
    @ApiProperty()
    @Column()
    @ApiProperty()
    Role:string
    @Column()
    RoleId:number
    
}