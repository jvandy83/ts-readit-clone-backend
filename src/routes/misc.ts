import { Request, Response, Router } from 'express';

import { createQueryBuilder, getConnection } from 'typeorm';

import Comment from '../entities/Comment';
import Post from '../entities/Post';
import User from '../entities/User';
import Vote from '../entities/Vote';
import Sub from '../entities/Sub';

import auth from '../middleware/auth';

const router = Router();

const vote = async (req: Request, res: Response) => {
	const { identifier, slug, commentIdentifier, value } = req.body;

	// Validate vote value

	console.log(req.body);

	if (![-1, 0, 1].includes(value)) {
		return res.status(400).json({
			error: 'Value must be -1, 0, 1',
		});
	}
	try {
		const user: User = res.locals.user;
		let post: Post | undefined = await Post.findOneOrFail({ slug, identifier });
		let vote: Vote | undefined;
		let comment: Comment | undefined;

		if (commentIdentifier) {
			// If there is a comment identifier find vote by comment
			comment = await Comment.findOneOrFail({ identifier: commentIdentifier });
			vote = await Vote.findOne({ user, comment });
		} else {
			//... Find vote by post
			vote = await Vote.findOne({ user, post });
		}

		if (!vote && value === 0) {
			// if no vote and value = 0 return error
			return res.status(404).json({
				error: 'Vote not found',
			});
		} else if (!vote) {
			// if no vote, create it
			vote = new Vote({ user, value });
			if (comment) vote.comment = comment;
			else vote.post = post;
			await vote.save();
		} else if (value === 0) {
			// If vote exists and value = 0 remove vote from db
			await vote.remove();
		} else if (vote.value !== value) {
			// If vote and value has changed, update vote
			vote.value = value;
			await vote.save();
		}

		post = await Post.findOne(
			{ identifier, slug },
			{ relations: ['sub', 'votes', 'comments', 'comments.votes'] },
		);

		post.setUserVote(user);

		post.comments.forEach((c) => c.setUserVote(user));

		return res.json(post);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: 'Something went wrong' });
	}
};

const topSubs = async (_: Request, res: Response) => {
	try {
		const imageUrlExp = `COALESCE(s."imageUrn", 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y')`;
		const subs = await getConnection()
			.createQueryBuilder()
			.select(
				`s.title, s.name, ${imageUrlExp} as "imageUrl", count(p.id) as "postCount"`,
			)
			.from(Sub, 's')
			.leftJoin(Post, 'p', `p."subname" = s.name`)
			.groupBy(`s.title, s.name, "imageUrl"`)
			.orderBy(`"postCount"`, 'DESC')
			.limit(5)
			.execute();
		return res.json(subs);
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: 'Something went wrong' });
	}
};

router.post('/vote', auth, vote);
router.get('/top-subs', topSubs);

export default router;
