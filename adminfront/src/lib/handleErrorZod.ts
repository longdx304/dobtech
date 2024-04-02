export default function handleErrorZod(resolver: any) {
	// Check success 
	if (resolver.success) {
		return false;
	}
	// 
	const errors = resolver.error.issues;

	// Reduce error return object
	return errors.reduce(
		(acc: Record<string, unknown>, current: Record<string, unknown>) => {
			acc[current.path[0]] = current.message;
			console.log('acc:', acc);
			return acc;
		},
		{}
	);
}
