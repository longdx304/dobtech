import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Handles errors returned by a Zod resolver.
 * @param resolver - The Zod resolver object.
 * @returns An object containing the reduced error messages.
 */
export default function handleErrorZod(resolver: any) {
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
