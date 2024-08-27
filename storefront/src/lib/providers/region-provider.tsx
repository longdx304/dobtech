'use client';
import { Region } from '@medusajs/medusa';
import React, {
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
	useMemo,
} from 'react';

type TRegionContext = {
	region: Region | null;
};

const defaultRegionContext: TRegionContext = {
	region: null,
};

const RegionContext = React.createContext(defaultRegionContext);

type TRegionProvider = {
	regionData: Region;
};

export const RegionProvider = ({
	children,
	regionData,
}: PropsWithChildren & TRegionProvider) => {
	const [region, setRegion] = useState<Region | null>(null);

	useEffect(() => {
		setRegion(regionData);
	}, [regionData]);

	const value = useMemo(() => ({ region }), [region]);

	return (
		<RegionContext.Provider value={value}>{children}</RegionContext.Provider>
	);
};

export const useRegion = () => {
	const context = useContext(RegionContext);
	if (context === undefined) {
		throw new Error('useRegion must be used within a RegionProvider');
	}
	return context;
};
