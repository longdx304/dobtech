
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
	permissions?: any;
	phone: string;
}

export enum ERole {
	ADMIN = 'admin',
	MEMBER = 'member',
}

export enum EPermissions {
	WarehouseManager = 'warehouse-manager',
	WarehouseStaff = 'warehouse-staff',
	Driver = 'driver',
	AssistantDriver = 'assistant-driver',
	InventoryChecker = 'inventory-checker',
}

export const rolesEmployee = Object.freeze([
	{ label: 'Quản lý kho', value: EPermissions.WarehouseManager },
	{ label: 'Nhân viên kho', value: EPermissions.WarehouseStaff },
	{ label: 'Tài xế', value: EPermissions.Driver },
	{ label: 'Kiểm hàng', value: EPermissions.InventoryChecker },
	{ label: 'Phụ xe', value: EPermissions.AssistantDriver },
]);

export type IUserRequest = {
	email: string;
	fullName: string;
	phone: string;
	permissions: string[];
};
