import { Entity, PrimaryGeneratedColumn, Column, ObjectID, BaseEntity } from 'typeorm'
import { Field, ID, ObjectType } from 'type-graphql'

@Entity()
@ObjectType('User', {})
export class UserModel extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
      id!: ObjectID

    @Field(() => String)
    @Column({ nullable: true })
      firstName!: string

    @Field(() => String)
    @Column({ nullable: true })
      lastName!: string
}
