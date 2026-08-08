type InventoryUnitSource = {
	quantity?: number | null;
	unit_id?: string | null;
	item_unit?: {
		id?: string | null;
		unit?: string | null;
		quantity?: number | null;
	} | null;
};

const formatNumber = (value: number) =>
	Number.isInteger(value)
		? value.toString()
		: value.toLocaleString('vi-VN', { maximumFractionDigits: 2 });

export const getInventoryUnitIssue = (
	inventory: InventoryUnitSource
): string | null => {
	if (!inventory.item_unit?.id || !inventory.unit_id) {
		return 'Bản ghi tồn kho đang thiếu đơn vị hàng';
	}

	const conversionQuantity = Number(inventory.item_unit.quantity);
	if (!Number.isFinite(conversionQuantity) || conversionQuantity <= 0) {
		return 'Đơn vị hàng có số lượng quy đổi không hợp lệ';
	}

	return null;
};

export const formatInventoryQuantity = (
	inventory: InventoryUnitSource
): string => {
	const rawQuantity = Number(inventory.quantity);
	if (!Number.isFinite(rawQuantity)) {
		return 'Không xác định';
	}

	if (getInventoryUnitIssue(inventory)) {
		return `${formatNumber(rawQuantity)} đôi (thiếu đơn vị quy đổi)`;
	}

	const conversionQuantity = Number(inventory.item_unit?.quantity);
	const convertedQuantity = rawQuantity / conversionQuantity;
	const unitLabel = inventory.item_unit?.unit?.trim() || 'đơn vị';

	return `${formatNumber(convertedQuantity)} ${unitLabel} (${formatNumber(
		rawQuantity
	)} đôi)`;
};

export const getInventoryMaxQuantity = (
	inventory: InventoryUnitSource
): number | undefined => {
	if (getInventoryUnitIssue(inventory)) return undefined;

	const rawQuantity = Number(inventory.quantity);
	const conversionQuantity = Number(inventory.item_unit?.quantity);
	if (!Number.isFinite(rawQuantity)) return undefined;

	return rawQuantity / conversionQuantity;
};
