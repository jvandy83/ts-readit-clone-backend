import {
	PrimaryGeneratedColumn,
	BaseEntity,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';

import { Exclude, classToPlain } from 'class-transformer';

export default abstract class Entity extends BaseEntity {
	@Exclude()
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	toJSON() {
		return classToPlain(this);
	}
}
