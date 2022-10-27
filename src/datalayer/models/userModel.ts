import { Entity, PrimaryGeneratedColumn, Column, ObjectID, BaseEntity } from 'typeorm'
import { Field, ID, ObjectType } from 'type-graphql'

@Entity({ name: 'users' })
@ObjectType('User', {})
export class UserModel extends BaseEntity {
    @PrimaryGeneratedColumn({ name: '_id' })
    @Field(() => ID)
      id!: ObjectID

    @Field(() => String)
    @Column({ nullable: true })
      email!: string

    @Field(() => String)
    @Column({ nullable: true })
      name!: string
}
