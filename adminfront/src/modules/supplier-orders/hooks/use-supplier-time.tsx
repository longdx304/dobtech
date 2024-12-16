import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Supplier } from '@/types/supplier';

const useSupplierTime = () => {
	const [supplierDates, setSupplierDates] = useState<{
		settlementDate: Dayjs | null;
		productionDate: Dayjs | null;
	}>({
		settlementDate: null,
		productionDate: null,
	});

	const handleSettlementDateChange = (date: Dayjs | null) => {
		setSupplierDates((prev) => ({ ...prev, settlementDate: date }));
	};

	const handleProductionDateChange = (date: Dayjs | null) => {
		setSupplierDates((prev) => ({ ...prev, productionDate: date }));
	};

	const updateDatesFromSupplier = (supplier: Supplier | null) => {
		if (supplier) {
			setSupplierDates({
				settlementDate: dayjs().add(supplier.settlement_time, 'day'),
				productionDate: dayjs().add(supplier.estimated_production_time, 'day'),
			});
		} else {
			setSupplierDates({
				settlementDate: null,
				productionDate: null,
			});
		}
	};

	return {
		supplierDates,
		setSupplierDates,
		handleSettlementDateChange,
		handleProductionDateChange,
		updateDatesFromSupplier,
	};
};

export default useSupplierTime;
