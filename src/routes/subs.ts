import { Request, Response, Router, NextFunction } from 'express';

import { getRepository } from 'typeorm';

import User from '../entities/User';
import Sub from '../entities/Sub';
import Post from '../entities/Post';

import auth from '../middleware/auth';
import user from '../middleware/user';

import multer, { FileFilterCallback } from 'multer';

import multerS3 from 'multer-s3';

import { s3, bucketPath, bucket } from '../../sdk/aws';

import { isEmpty } from 'class-validator';
import { makeId } from '../util/helper';
import { URL } from 'url';

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

const ownSub = async (req: Request, res: Response, next: NextFunction) => {
	const user: User = res.locals.user;

	try {
		const sub = await Sub.findOneOrFail({ where: { name: req.params.name } });

		if (sub.username !== user.username) {
			return res.status(403).json({ error: "You don't own this sub" });
		}

		res.locals.sub = sub;
		return next();
	} catch (error) {
		return res.status(500).json({ error: 'Something went wrong' });
	}
};

const upload = multer({
	storage: multerS3({
		s3: s3,
		bucket: bucket,
		metadata: function (_, file, cb) {
			cb(null, { fieldName: file.fieldname });
		},
		key: function (_, file, cb) {
			cb(null, file.originalname + '_' + Date.now().toString());
		},
	}),
	fileFilter: (_, file: any, cb: FileFilterCallback) => {
		if (
			file.mimetype === 'image/jpeg' ||
			file.mimetype === 'image/png' ||
			file.mimetype === 'image/jpg'
		) {
			cb(null, true);
		} else {
			cb(new Error('Not an image'));
		}
	},
});

const uploadSubImage = async (req: Request, res: Response) => {
	const sub = res.locals.sub;
	try {
		const type = req.body.type;

		if (type !== 'image' && type !== 'banner') {
			try {
				await s3
					.deleteObject({
						Bucket: bucket,
						Key: req.file['key'],
					})
					.promise();
			} catch (err) {
				if (err) console.log('ERROR OBJECT S3: ', err);
				return res.status(400).json({ error: 'Invalid type' });
			}
		}

		// check to see if imageUrn or
		// bannerUrn already exists and
		// if so, delete it before
		// adding a new image

		let oldImageUrn: string = '';

		if (type === 'image') {
			oldImageUrn = sub.imageUrn || '';
			sub.imageUrn = `${bucketPath}/${req.file['key']}`;
		} else if (type === 'banner') {
			oldImageUrn = sub.imageUrn || '';
			sub.bannerUrn = `${bucketPath}/${req.file['key']}`;
		}

		if (oldImageUrn !== '') {
			const url = new URL(oldImageUrn);
			console.log(url);
			try {
				await s3
					.deleteObject({
						Bucket: bucket,
						Key: url.pathname,
					})
					.promise();
			} catch (err) {
				console.log('ERROR OBJECT S3: ', err);
			}
		}

		await sub.save();
		return res.json(sub);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Something went wrong' });
	}
};

router.post('/', user, auth, createSub);
router.get('/:name', user, getSub);
router.post(
	'/:name/image',
	user,
	auth,
	ownSub,
	upload.single('file'),
	uploadSubImage,
);

export default router;
