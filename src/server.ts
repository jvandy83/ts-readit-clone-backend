import 'reflect-metadata';

import { createConnection } from 'typeorm';

import User from './entities/User';

import express, { Request, Response } from 'express';

import morgan from 'morgan';

import authRoutes from './routes/auth';

const PORT = process.env.PORT || 3000;

import trim from './middleware/trim';

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(trim);

app.get('/', (req: Request, res: Response) => {
	res.send('Hello World!');
});
app.use('/api/auth', authRoutes);

app.listen(3000, async () => {
	console.log('App listening on port 3000');
	try {
		await createConnection();
		console.log('Database connected');
	} catch (err) {
		console.log(err);
	}
});
