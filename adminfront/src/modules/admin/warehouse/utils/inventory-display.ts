type InventoryUnitSource = {
	quantity?: number | null;
	unit_id?: string | null;
	item_unit?: {
		id?: string | null;
		unit?: string | null;
		quantity?: number | null;
	} | null;
};

const asInventorySource = (
	inventory: InventoryUnitSource | null | undefined
): InventoryUnitSource =>
	inventory && typeof inventory === 'object' ? inventory : {};

const toFiniteNumber = (value: unknown): number | undefined => {
	try {
		const numberValue = Number(value);
		return Number.isFinite(numberValue) ? numberValue : undefined;
	} catch {
		return undefined;
	}
};

const formatNumber = (value: number) =>
	Number.isInteger(value)
		? value.toString()
		: value.toLocaleString('vi-VN', { maximumFractionDigits: 2 });

export const getInventoryUnitIssue = (
	inventory: InventoryUnitSource | null | undefined
): string | null => {
	const source = asInventorySource(inventory);
	if (!source.item_unit?.id || !source.unit_id) {
		return 'Bản ghi tồn kho đang thiếu đơn vị hàng';
	}

	const conversionQuantity = toFiniteNumber(source.item_unit.quantity);
	if (conversionQuantity === undefined || conversionQuantity <= 0) {
		return 'Đơn vị hàng có số lượng quy đổi không hợp lệ';
	}

	return null;
};

export const formatInventoryQuantity = (
	inventory: InventoryUnitSource | null | undefined
): string => {
	const source = asInventorySource(inventory);
	const rawQuantity = toFiniteNumber(source.quantity);
	if (rawQuantity === undefined) {
		return 'Không xác định';
	}

	if (getInventoryUnitIssue(inventory)) {
		return `${formatNumber(rawQuantity)} đôi (thiếu đơn vị quy đổi)`;
	}

	const conversionQuantity = toFiniteNumber(source.item_unit?.quantity) ?? 1;
	const convertedQuantity = rawQuantity / conversionQuantity;
	const unit = source.item_unit?.unit;
	const unitLabel = typeof unit === 'string' && unit.trim() ? unit.trim() : 'đơn vị';

	return `${formatNumber(convertedQuantity)} ${unitLabel} (${formatNumber(
		rawQuantity
	)} đôi)`;
};

export const getInventoryMaxQuantity = (
	inventory: InventoryUnitSource | null | undefined
): number | undefined => {
	if (getInventoryUnitIssue(inventory)) return undefined;

	const source = asInventorySource(inventory);
	const rawQuantity = toFiniteNumber(source.quantity);
	const conversionQuantity = toFiniteNumber(source.item_unit?.quantity);
	if (rawQuantity === undefined || conversionQuantity === undefined) {
		return undefined;
	}

	return rawQuantity / conversionQuantity;
};
