import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../entities/User';

export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.cookies.jid;
		if (!token) throw new Error('Unauthenticated');
		// jsonwebtoken package will throw error if
		// token is invalid
		const { username }: any = jwt.verify(token, process.env.JWT_SECRET);
		console.log('USERNAME: ', username);

		const user = await User.findOne({ username });

		console.log('USER: ', user);

		if (!user) throw new Error('Unauthenticated');

		res.locals.user = user;

		return next();
	} catch (err) {
		res.status(401).json({ error: err.message });
	}
};
