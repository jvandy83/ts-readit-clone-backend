import {
	Entity as TOEntity,
	Column,
	Index,
	ManyToOne,
	JoinColumn,
	BeforeInsert,
	OneToMany,
} from 'typeorm';

import { makeId, slugify } from '../util/helper';

import { Expose, Exclude } from 'class-transformer';

import Entity from './Entity';
import Sub from './Sub';
import Comment from './Comment';
import User from './User';
import Vote from './Vote';

@TOEntity('posts')
export default class Post extends Entity {
	constructor(post: Partial<Post>) {
		super();
		Object.assign(this, post);
	}

	@Index()
	@Column()
	identifier: string | undefined; // 7 character id

	@Column()
	title: string | undefined; // 7 character id

	@Index()
	@Column()
	slug: string | undefined; // 7 character id

	@Column({ nullable: true, type: 'text' })
	body: string | undefined; // 7 character id

	@Column({ nullable: true })
	subname: string | undefined;

	@Column()
	username: string | undefined;

	@Expose() get url(): string {
		return `/r/${this.subname}/${this.identifier}/${this.slug}`;
	}

	// protected url: string;
	// @AfterLoad()
	// createFields() {
	// 	this.url = `/r/${this.subname}/${this.identifier}/${this.slug}`;
	// }

	@ManyToOne(() => User, (user) => user.posts)
	@JoinColumn({ name: 'username', referencedColumnName: 'username' })
	user: User | undefined;

	@ManyToOne(() => Sub, (sub) => sub.posts)
	@JoinColumn({ name: 'subname', referencedColumnName: 'name' })
	sub: Sub | undefined;

	@OneToMany(() => Comment, (comment) => comment.post)
	comments: Comment[] | undefined;

	@OneToMany(() => Vote, (vote) => vote.post)
	votes: Vote[] | undefined;

	@Expose() get commentCount(): number {
		return this.comments?.length!;
	}

	@Expose() get voteScore(): number {
		return this.votes?.reduce(
			(prev, curr) => prev + (curr.value || 0),
			0,
		) as number;
	}

	protected userVote: number | undefined;
	setUserVote(user: User): any {
		const index: number = this.votes?.findIndex(
			(v) => v.username === user.username,
		) as number;
		this.userVote = index > -1 ? this.votes![index].value : 0;
	}

	@BeforeInsert()
	makeIdAndSlug(): void {
		this.identifier = makeId(7);
		this.slug = slugify(this.title!);
	}
}
