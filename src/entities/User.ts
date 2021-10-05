import {
	Entity as TOEntity,
	Column,
	Index,
	BeforeInsert,
	OneToMany,
} from 'typeorm';

import { Exclude } from 'class-transformer';

import { IsEmail, Length } from 'class-validator';

import { hash } from 'bcrypt';

import Entity from './Entity';

import Post from './Post';
import Vote from './Vote';

@TOEntity('users')
export default class User extends Entity {
	constructor(user: Partial<User>) {
		super();
		Object.assign(this, user);
	}

	@Index()
	@IsEmail(undefined, { message: 'Must be a valid email address' })
	@Length(1, 255, { message: 'Email is empty' })
	@Column({ unique: true })
	email: string | undefined;

	@Column({ unique: true })
	@Index()
	@Length(3, 255, { message: 'Must be at least 3 characters long' })
	username: string | undefined;

	@Column()
	@Exclude()
	@Length(6, 255, { message: 'Must be at least 6 characters long' })
	password: string | undefined;

	@OneToMany(() => Post, (post) => post.user)
	posts: Post[] | undefined;

	@OneToMany(() => Vote, (vote) => vote.user)
	votes: Vote[] | undefined;

	@BeforeInsert()
	async hashPassword() {
		this.password = await hash(this.password!, 10);
	}
}
