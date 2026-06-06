import { AccessPermission } from './access-control';
import { ERole } from '@/types/account';

export interface AdminAccessProfile {
	role: ERole;
	page_permissions: AccessPermission[];
	default_route: string | null;
}

export type AdminAccessProfileResult =
	| { type: 'ok'; profile: AdminAccessProfile }
	| { type: 'auth_failed' }
	| { type: 'unavailable' };

export function classifyAdminAccessProfileStatus(
	status: number
): Exclude<AdminAccessProfileResult['type'], 'ok'> {
	return status === 401 || status === 403 ? 'auth_failed' : 'unavailable';
}
