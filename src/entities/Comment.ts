import {
	BeforeInsert,
	Column,
	Entity as TOEntity,
	JoinColumn,
	ManyToOne,
	Index,
	OneToMany,
} from 'typeorm';

import { Expose } from 'class-transformer';

import Entity from './Entity';
import Post from './Post';
import User from './User';
import Vote from './Vote';

import { makeId } from '../util/helper';

import { Exclude } from 'class-transformer';

@TOEntity('comments')
export default class Comment extends Entity {
	constructor(comment: Partial<Comment>) {
		super();
		Object.assign(this, comment);
	}

	@Index()
	@Column()
	identifier: string | undefined;

	@Column()
	body: string | undefined;

	@Column()
	username: string | undefined;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'username', referencedColumnName: 'username' })
	user: User | undefined;

	@ManyToOne(() => Post, (post) => post.comments, { nullable: false })
	post: Post | undefined;

	@Exclude()
	@OneToMany(() => Vote, (vote) => vote.comment)
	votes: Vote[] | undefined;

	@Expose() get voteScore(): number {
		return this.votes?.reduce(
			(prev, curr) => prev + (curr.value || 0),
			0,
		) as number;
	}

	protected userVote: number | undefined;
	setUserVote(user: User) {
		const index = this.votes?.findIndex(
			(v) => v.username === user.username,
		) as number;
		this.userVote = index > -1 ? this.votes![index].value : 0;
	}

	@BeforeInsert()
	makeIdAndSlug() {
		this.identifier = makeId(8);
	}
}
