// @ts-nocheck -- Jest currently cannot load because this repo is missing ts-node.
import {
	AccessPermission,
	getDefaultAdminRoute,
	hasAdminRouteAccess,
	mergeAccessControlMetadata,
	resolvePagePermissions,
} from '@/lib/access-control';

describe('access control', () => {
	it('falls back to role presets for legacy users', () => {
		expect(resolvePagePermissions({ permissions: 'Warehouse,accountant' })).toEqual(
			expect.arrayContaining([
				AccessPermission.PurchasesSuppliers,
				AccessPermission.WarehouseInbound,
			])
		);
	});

	it('uses metadata page permissions as an override', () => {
		expect(
			resolvePagePermissions({
				permissions: 'manager',
				metadata: {
					access_control: {
						page_permissions: [AccessPermission.SettingsRegions],
					},
				},
			})
		).toEqual([AccessPermission.SettingsRegions]);
	});

	it('matches child routes before the admin dashboard route', () => {
		expect(
			hasAdminRouteAccess('/admin/regions', [AccessPermission.DashboardView])
		).toBe(false);
		expect(
			hasAdminRouteAccess('/admin/regions', [AccessPermission.SettingsRegions])
		).toBe(true);
	});

	it('returns the first permitted route', () => {
		expect(getDefaultAdminRoute([AccessPermission.SettingsItemUnits])).toBe(
			'/admin/item-unit'
		);
	});

	it('merges page permissions without dropping existing metadata', () => {
		expect(
			mergeAccessControlMetadata(
				{ custom: 'kept', access_control: { note: 'kept' } },
				[AccessPermission.SettingsRegions]
			)
		).toEqual({
			custom: 'kept',
			access_control: {
				note: 'kept',
				page_permissions: [AccessPermission.SettingsRegions],
			},
		});
	});
});
