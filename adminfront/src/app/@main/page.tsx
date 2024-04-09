import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Admin Dashboard',
	description: 'Admin Page',
};

export default function Main() {
	return <div className="h-full w-full flex justify-center">Dashboard</div>;
}
