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

import { Expose } from 'class-transformer';

import Entity from './Entity';
import Sub from './Sub';
import Comment from './Comment';
import User from './User';

@TOEntity('posts')
export default class Post extends Entity {
	constructor(post: Partial<Post>) {
		super();
		Object.assign(this, post);
	}

	@Index()
	@Column()
	identifier: string; // 7 character id

	@Column()
	title: string; // 7 character id

	@Index()
	@Column()
	slug: string; // 7 character id

	@Column({ nullable: true, type: 'text' })
	body: string; // 7 character id

	@Column({ nullable: true })
	subname: string;

	@Column()
	username: string;

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
	user: User;

	@ManyToOne(() => Sub, (sub) => sub.posts)
	@JoinColumn({ name: 'subname', referencedColumnName: 'name' })
	sub: Sub;

	@OneToMany(() => Comment, (comment) => comment.post)
	comments: Comment[];

	@BeforeInsert()
	makeIdAndSlug(): void {
		this.identifier = makeId(7);
		this.slug = slugify(this.title);
	}
}
