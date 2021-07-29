import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	Index,
	CreateDateColumn,
	UpdateDateColumn,
	BeforeInsert,
} from 'typeorm';

import { Exclude, classToPlain } from 'class-transformer';

import { IsEmail, Length } from 'class-validator';

import { hash } from 'bcrypt';

@Entity('users')
export default class User extends BaseEntity {
	constructor(user: Partial<User>) {
		super();
		Object.assign(this, user);
	}

	@Exclude()
	@PrimaryGeneratedColumn()
	id: number;

	@Index()
	@IsEmail()
	@Column({ unique: true })
	email: string;

	@Column({ unique: true })
	@Index()
	@Length(3, 255, { message: 'Username must be at least 3 characters long' })
	username: string;

	@Column()
	@Exclude()
	@Length(6, 255)
	password: string;

	@CreateDateColumn()
	createAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@BeforeInsert()
	async hashPassword() {
		this.password = await hash(this.password, 10);
	}

	toJSON() {
		return classToPlain(this);
	}
}
