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
	metadata: JSON | null;
}

export enum ERoleEmp {
	WarehouseManager = 'warehouse-manager',
	WarehouseStaff = 'warehouse-staff',
	Driver = 'driver',
	AssistantDriver = 'assistant-driver',
	InventoryChecker = 'inventory-checker',
}

export const rolesEmployee = Object.freeze([
	{ label: 'Quản lý kho', value: ERoleEmp.WarehouseManager },
	{ label: 'Nhân viên kho', value: ERoleEmp.WarehouseStaff },
	{ label: 'Tài xế', value: ERoleEmp.Driver },
	{ label: 'Kiểm hàng', value: ERoleEmp.InventoryChecker },
	{ label: 'Phụ xe', value: ERoleEmp.AssistantDriver },
]);

export type IUserRequest = {
	email: string;
	fullName: string;
	phone: string;
	rolesUser: string[];
};
