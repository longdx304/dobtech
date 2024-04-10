export interface IAdminAuth {
	email: string;
	password: string;
}

export interface IAdminResponse {
	id: string;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
	role: string;
	email: string;
	first_name: string | null;
	last_name: string | null;
	api_token: string | null;
	metadata: json | null;
}

export enum ERoleEmp {
	WarehouseManager = '1',
	WarehouseStaff = '2',
	Driver = '3',
	AssistantDriver = '4',
	InventoryChecker = '5',
}

export const rolesEmployee = Object.freeze([
	{ label: 'Quản lý kho', value: ERoleEmp.WarehouseManager },
	{ label: 'Nhân viên kho', value: ERoleEmp.WarehouseStaff },
	{ label: 'Tài xế', value: ERoleEmp.Driver },
	{ label: 'Kiểm hàng', value: ERoleEmp.InventoryChecker },
	{ label: 'Phụ xe', value: ERoleEmp.AssistantDriver },
]);
