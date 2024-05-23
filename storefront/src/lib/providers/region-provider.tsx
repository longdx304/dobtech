"use client";
import React, {
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from "react";
import { Region } from "@medusajs/medusa/dist/types/pricing";

type TRegionContext = {
	region: Region;
};

const defaultRegionContext: TRegionContext = {
	region: null,
};

const RegionContext = React.createContext(defaultRegionContext);

type TRegionProvider = {
	region: Region;
};

export const RegionProvider = ({
	children,
	regionData,
}: PropsWithChildren & TRegionProvider) => {
	const [region, setRegion] = useState<Region>(null);

	useEffect(() => {
		setRegion(regionData);
	}, [regionData]);

	return (
		<RegionContext.Provider value={{ region }}>
			{children}
		</RegionContext.Provider>
	);
};

export const useRegion = () => {
	const context = useContext(RegionContext);
	if (context === undefined) {
		throw new Error("useRegion must be used within a RegionProvider");
	}
	return context;
};
