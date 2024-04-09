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
