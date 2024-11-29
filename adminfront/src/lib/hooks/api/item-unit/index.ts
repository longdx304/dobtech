// @ts-nocheck
/**
 * @packageDocumentation
 * 
 * Queries and Mutations listed here are used to send requests to the [Admin Currency API Routes](https://docs.medusajs.com/api/admin#currencies).
 * 
 * All hooks listed require {@link Hooks.Admin.Auth.useAdminLogin | user authentication}.
 * 
 * A store can use unlimited currencies, and each region must be associated with at least one currency.
 * ItemUnit are defined within the Medusa backend. The methods in this class allow admins to list and update currencies.
 * 
 * @customNamespace Hooks.Admin.ItemUnit
 */

export * from "./mutations"
export * from "./queries"
