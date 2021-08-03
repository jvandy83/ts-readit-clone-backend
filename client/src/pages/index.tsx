import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

import RedditLogo from '../images/reddit.svg';

export default function Home() {
	return (
		<div className={styles.container}>
			<Head>
				<title>readit: the front page of the internet</title>
			</Head>
			<div className='fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 bg-white'>
				{/* Logo and title */}
				<div className='flex items-center'>
					<Link href='/'>
						<a>
							<RedditLogo className='w-8 h-8 mr-2' />
						</a>
					</Link>
				</div>
				<span className='text-2xl font-semibold'>
					<Link href='/'>Readit</Link>
				</span>
				{/* Search input */}
				{/* Auth buttons */}
			</div>
		</div>
	);
}
