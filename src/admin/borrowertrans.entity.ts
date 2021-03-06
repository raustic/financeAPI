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
    givenDate:Date
    @Column()
    CaseId:string
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
   // @ApiProperty()
    //Partner1Mobile:string
    //@Column()
    //@ApiProperty()
    //Partner1Name:string
    //@Column()
    //@ApiProperty()
    //Partner1Amount:string
   // @Column()
   // @ApiProperty()
    //Partner1PerOrRate:string
   // @ApiProperty()
   // Partner2Mobile:string
    //@Column()
    //@ApiProperty()
    //Partner2Name:string
    //@Column()
    //@ApiProperty()
    //Partner2Amount:string
    //@Column()
    //@ApiProperty()
    //Partner2PerOrRate:string
   // @ApiProperty()
    //Partner3Mobile:string
    //@Column()
    //@ApiProperty()
    //Partner3Name:string
    //@Column()
    //@ApiProperty()
    //Partner3Amount:string
    //@Column()
    //@ApiProperty()
    //Partner3PerOrRate:string
    //@ApiProperty()
    //Partner4Mobile:string
    //@Column()
    //@ApiProperty()
    //Partner4Name:string
    //@Column()
    //@ApiProperty()
    //Partner4Amount:string
    //@Column()
    //@ApiProperty()
    //Partner4PerOrRate:string
    //@ApiProperty()
    //Partner5Mobile:string
    //@Column()
    //@ApiProperty()
    //Partner5Name:string
    //@Column()
    //@ApiProperty()
    //Partner5Amount:string
    //@Column()
    //@ApiProperty()
    //Partner5PerOrRate:string
    //@ApiProperty()
    @Column()
    @ApiProperty()
    Role:string
    @Column()
    RoleId:number
    @ApiProperty()
    @Column()
    IsOpen:number
    @Column()
    @ApiProperty()
    totalemi:number   
    @Column()
    @ApiProperty()
    emiamt:number
    @Column()
    @ApiProperty()
    caseUpto:number
    @ApiProperty()
    @Exclude()
    newGivenDate:string
}