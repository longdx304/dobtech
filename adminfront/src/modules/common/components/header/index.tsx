'use client';
import { FC } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import { Menu } from 'lucide-react';
import Image from 'next/image';

interface Props {}

const Header = (): FC<Props> => {
	return (
		<AppBar position="fixed" color="white" sx={{ bottom: 'auto', top: 0 }}>
			<Toolbar className="flex justify-between items-center">
				<div>
					<Image
						src="/images/dob-icon.png"
						width={32}
						height={43}
						alt="Dob Icon"
					/>
				</div>
				<IconButton color="inherit" aria-label="open drawer">
					<Menu />
				</IconButton>
			</Toolbar>
		</AppBar>
	);
};

export default Header;
