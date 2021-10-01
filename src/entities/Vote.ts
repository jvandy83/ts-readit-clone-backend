import { Entity as TOEntity, Column, ManyToOne, JoinColumn } from 'typeorm';

import Entity from './Entity';
import Comment from './Comment';
import User from './User';
import Post from './Post';

@TOEntity('votes')
export default class Vote extends Entity {
	constructor(vote: Partial<Vote>) {
		super();
		Object.assign(this, vote);
	}

	@Column()
	value: number;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'username', referencedColumnName: 'username' })
	user: User;

	@Column()
	username: string;

	@ManyToOne(() => Comment)
	comment: Comment;

	@ManyToOne(() => Post)
	post: Post;
}
