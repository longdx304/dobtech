import { describe, expect, it } from '@jest/globals';
import { classifyAdminAccessProfileStatus } from '@/lib/admin-access-profile';

describe('admin access profile response classification', () => {
	it('treats backend auth failures as login-required, not access-denied', () => {
		expect(classifyAdminAccessProfileStatus(401)).toBe('auth_failed');
		expect(classifyAdminAccessProfileStatus(403)).toBe('auth_failed');
	});

	it('treats other failures as unavailable profile data', () => {
		expect(classifyAdminAccessProfileStatus(500)).toBe('unavailable');
		expect(classifyAdminAccessProfileStatus(404)).toBe('unavailable');
	});
});
