import { useMemo, useState } from 'react';
import {
	useAdminRegions,
	useAdminStore,
	useAdminUpdateVariant,
} from 'medusa-react';
import { Product } from '@medusajs/medusa';
import {
	getAllProductPricesCurrencies,
	getAllProductPricesRegions,
	getCurrencyPricesOnly,
	getRegionPricesOnly,
} from './utils';
/**
 * Return map of regionIds <> currency_codes
 */
function useRegionsCurrencyMap() {
	const map = {};
	const { regions: storeRegions } = useAdminRegions({
		limit: 1000,
	});

	storeRegions?.forEach((r) => {
		map[r.id] = r.currency_code;
	});

	return useMemo(() => map, [storeRegions]);
}

const usePrices = (product: Product) => {
	const { regions: storeRegions } = useAdminRegions({
		limit: 1000,
	});
	const { store } = useAdminStore();
	const regionCurrenciesMap = useRegionsCurrencyMap();
	const regions = getAllProductPricesRegions(product).sort();
	const currencies = getAllProductPricesCurrencies(product).sort();

	// Default Vietnam Dong
	const initialCurrencies = ['vnd'];
	// const initialCurrencies =
	// 	!currencies.length && !regions.length
	// 		? store?.currencies.map((c) => c.code)
	// 		: currencies;

	const [selectedCurrencies, setSelectedCurrencies] =
		useState(initialCurrencies);

	const [selectedRegions, setSelectedRegions] = useState<string[]>(regions);

	const toggleCurrency = (currencyCode: string) => {
		const set = new Set(selectedCurrencies);
		if (set.has(currencyCode)) {
			set.delete(currencyCode);
		} else {
			set.add(currencyCode);
		}

		setSelectedCurrencies(Array.from(set));
	};

	const toggleRegion = (regionId: string) => {
		const set = new Set(selectedRegions);
		if (set.has(regionId)) {
			set.delete(regionId);
		} else {
			set.add(regionId);
		}

		setSelectedRegions(Array.from(set));
	};
	return {
		selectedCurrencies,
		setSelectedCurrencies,
		selectedRegions,
		setSelectedRegions,
		toggleCurrency,
		toggleRegion,
		storeRegions,
	};
};

export default usePrices;
