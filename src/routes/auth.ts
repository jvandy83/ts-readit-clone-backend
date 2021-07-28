import { Request, Response, Router } from 'express';
import { User } from '../entities/User';

const register = async (req: Request, res: Response) => {
	const { email, username, password } = req.body;

	try {
		//...Validate Data
		// Create user
		const user = new User({ email, username, password });
		await user.save();
		return res.json(user);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

const router = Router();

router.post('/register', register);

export default router;
