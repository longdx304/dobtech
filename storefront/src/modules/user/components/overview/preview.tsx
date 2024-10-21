'use client';
import { useCart } from '@/lib/providers/cart/cart-provider';
import useIsDesktop from '@/modules/common/hooks/useIsDesktop';
import { useEffect } from 'react';
import OverviewDesktop from './OverviewDesktop';
import OverviewMobile from './OverviewMobile';

const OverviewPreview = () => {
	const { refreshCart } = useCart();

	useEffect(() => {
		refreshCart();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const isDesktop = useIsDesktop();
	return isDesktop ? <OverviewDesktop /> : <OverviewMobile />;
};

export default OverviewPreview;
