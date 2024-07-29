'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import useIsDesktop from '@/modules/common/hooks/useIsDesktop';

const OverviewDesktop = dynamic(() => import('./OverviewDesktop'));
const OverviewMobile = dynamic(() => import('./OverviewMobile'));

const OverviewPreview = () => {
	const isDesktop = useIsDesktop();
	return isDesktop ? <OverviewDesktop /> : <OverviewMobile />;
};

export default OverviewPreview;
