'use client';

import React, { PropsWithChildren, useContext, useMemo, useState } from 'react';

type VariantImagesContextType = {
	optionValue: string | undefined;
	setOptionValue: (value?: string) => void;
};
const defaultVariantImagesContext: VariantImagesContextType = {
	optionValue: undefined,
	setOptionValue: () => {},
};

const VariantImagesContext = React.createContext(defaultVariantImagesContext);

export const VariantImagesProvider = ({ children }: PropsWithChildren) => {
	const [optionValue, setOptionValue] = useState<string>();

	const value = useMemo(
		() => ({
			optionValue,
			setOptionValue,
		}),
		[optionValue, setOptionValue]
	);
	return (
		<VariantImagesContext.Provider value={value}>
			{children}
		</VariantImagesContext.Provider>
	);
};

export const useVariantImages = () => {
	const context = useContext(VariantImagesContext);
	if (context === undefined) {
		throw new Error(
			'useVariantImages must be used within a VariantImagesProvider'
		);
	}
	return context;
};
