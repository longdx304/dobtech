'use client';
import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import useIsDesktop from '@/modules/common/hooks/useIsDesktop';
import { useCart } from '@/lib/providers/cart/cart-provider';

const OverviewDesktop = dynamic(() => import('./OverviewDesktop'));
const OverviewMobile = dynamic(() => import('./OverviewMobile'));

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
