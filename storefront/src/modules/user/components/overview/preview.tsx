'use client';
import { useCart } from '@/lib/providers/cart/cart-provider';
import { useEffect } from 'react';
import ItemGroup from './item-group';

const OverviewPreview = () => {
	const { refreshCart } = useCart();

	useEffect(() => {
		refreshCart();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div>
			<ItemGroup />
		</div>
	);
};

export default OverviewPreview;
