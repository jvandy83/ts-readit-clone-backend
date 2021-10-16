import express, { Request, Response } from 'express';

import user from '../middleware/user';

import auth from '../middleware/auth';

import Post from '../entities/Post';

const router = express.Router();

const getUserSubmissions = async (req: Request, res: Response) => {
	const user = res.locals.user;
	try {
		const posts = await Post.find({
			where: { user },
			relations: ['comments', 'votes'],
			order: { createdAt: 'DESC' },
		});
		return res.status(200).json(posts);
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			error: 'Something went wrong',
		});
	}
};

router.get('/:username', user, auth, getUserSubmissions);

export default router;
