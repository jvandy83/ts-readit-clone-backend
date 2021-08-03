import 'reflect-metadata';

import { createConnection } from 'typeorm';

import express, { Response } from 'express';

import morgan from 'morgan';

import cookieParser from 'cookie-parser';

import cors from 'cors';

import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth';
import postRoutes from './routes/posts';
import subRoutes from './routes/subs';

import trim from './middleware/trim';

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}
app.use(trim());
app.use(cookieParser());
app.use(
	cors({
		credentials: true,
		origin: process.env.ORIGIN,
		optionsSuccessStatus: 200,
	}),
);

app.get('/', (_, res: Response) => {
	return res.send('Hello World!');
});
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/subs', subRoutes);

app.listen(PORT, async () => {
	console.log(`App listening on port ${PORT}`);
	try {
		await createConnection();
		console.log('Database connected');
	} catch (err) {
		console.log(err);
	}
});
