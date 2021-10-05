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
	id: number | undefined;

	@CreateDateColumn()
	createdAt: Date | undefined;

	@UpdateDateColumn()
	updatedAt: Date | undefined;

	toJSON() {
		return classToPlain(this);
	}
}
