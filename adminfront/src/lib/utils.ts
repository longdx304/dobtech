import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Handles errors returned by a Zod resolver.
 * @param resolver - The Zod resolver object.
 * @returns An object containing the reduced error messages.
 */
export function handleErrorZod(resolver: any) {
	// Check success
	if (resolver.success) {
		return false;
	}
	const errors = resolver.error.issues;

	// Reduce error return object
	return errors.reduce(
		(acc: Record<string, unknown>, current: Record<string, unknown>) => {
			acc[(current.path as string[])[0]] = current.message;
			return acc;
		},
		{}
	);
}

/**
 * Use update search query
 */
export const updateSearchQuery = (
	searchParams: any,
	updateQuery: Record<string, string>
) => {
	const newSearchParams = new URLSearchParams(searchParams.toString());
	for (const [key, value] of Object.entries(updateQuery)) {
		value ? newSearchParams.set(key, value) : newSearchParams.delete(key);
	}
	return newSearchParams.toString();
};

/**
 * @param num 
 * @param option 
 * @returns format price number
 */
const formatNumber = (num: number, option?: Intl.NumberFormatOptions) => {
  return num?.toLocaleString('vi-VN', option);
};

export default formatNumber;

export const getErrorMessage = (error: any) => {
  let msg = error?.response?.data?.message
  if (msg[0].message) {
    msg = msg[0].message
  }
  if (!msg) {
    msg = "Đã xảy ra lỗi khi thực hiện thao tác. Vui lòng thử lại sau."
  }
  return msg
}
