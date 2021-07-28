import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	Index,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';

import { IsEmail, Min } from 'class-validator';

@Entity('users')
export default class User extends BaseEntity {
	constructor(user: Partial<User>) {
		super();
		Object.assign(this, user);
	}
	@PrimaryGeneratedColumn()
	id: number;

	@Index()
	@IsEmail()
	@Column({ unique: true })
	email: string;

	@Column({ unique: true })
	@Index()
	@Min(3, { message: 'Username must be at least 3 characters long' })
	username: string;

	@Column()
	@Min(6)
	password: string;

	@CreateDateColumn()
	createAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
