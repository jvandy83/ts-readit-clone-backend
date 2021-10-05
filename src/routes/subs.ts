import { Request, Response, Router } from 'express';

import { getRepository } from 'typeorm';

import User from '../entities/User';
import Sub from '../entities/Sub';
import auth from './auth';
import user from '../middleware/user';
import Post from '../entities/Post';

import { isEmpty } from 'class-validator';

const router = Router();

const createSub = async (req: Request, res: Response) => {
	const { name, title, description } = req.body;

	const user: User = res.locals.user;

	try {
		let errors: any = {};
		if (isEmpty(name)) errors.name = 'Name must not be empty';
		if (isEmpty(title)) errors.title = 'Title must not be empty';

		let sub = await getRepository(Sub)
			.createQueryBuilder('sub')
			.where('lower(sub.name) = :name', { name: name.toLowerCase() })
			.getOne();

		if (sub) errors.name = 'Sub exists already';

		if (Object.keys(errors).length > 0) {
			throw errors;
		}
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}

	try {
		const sub = new Sub({ name, title, description, user });
		await sub.save();

		return res.json(sub);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: 'Something went wrong' });
	}
};

const getSub = async (req: Request, res: Response) => {
	const name = req.params.name;
	console.log(res.locals.user);

	try {
		const sub = await Sub.findOneOrFail({ name });
		const posts = await Post.find({
			where: { sub },
			order: { createdAt: 'DESC' },
			relations: ['comments', 'votes'],
		});

		sub.posts = posts;

		if (res.locals.user) {
			sub.posts.forEach((p) => p.setUserVote(res.locals.user));
		}

		return res.json(sub);
	} catch (err) {
		console.log(err);
		return res.status(404).json({ sub: 'Sub not found' });
	}
};

router.post('/', user, auth, createSub);
router.get('/:name', user, getSub);

export default router;
