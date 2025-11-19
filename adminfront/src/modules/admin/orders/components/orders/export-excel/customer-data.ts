export interface CustomerData {
	code: string;
	name: string;
}

/**
 * Parse customer data from CSV content
 */
export const parseCustomerCSV = (csvContent: string): CustomerData[] => {
	const customers: CustomerData[] = [];
	const lines = csvContent.split('\n');
	
	// Skip first 2 header lines
	for (let i = 2; i < lines.length; i++) {
		const line = lines[i].trim();
		if (!line || line.startsWith('Số dòng')) continue;
		
		// Split by comma, handling quoted values
		const match = line.match(/^"?([^",]+)"?,(.+)$/);
		if (match) {
			const code = match[1].trim();
			const name = match[2].trim().replace(/^"|"$/g, '');
			
			if (code && name) {
				customers.push({ code, name });
			}
		}
	}
	
	return customers;
};

/**
 * Load customer data from CSV file
 */
export const loadCustomerData = async (): Promise<CustomerData[]> => {
	try {
		const response = await fetch('/data/customer_data.csv');
		const csvText = await response.text();
		return parseCustomerCSV(csvText);
	} catch (error) {
		console.error('Error loading customer data:', error);
		return [];
	}
};

/**
 * Search customers by name or code
 */
export const searchCustomers = (
	customers: CustomerData[],
	searchTerm: string
): CustomerData[] => {
	if (!searchTerm) return customers;
	
	const term = searchTerm.toLowerCase();
	return customers.filter(
		customer =>
			customer.name.toLowerCase().includes(term) ||
			customer.code.toLowerCase().includes(term)
	);
};

/**
 * Paginate customers
 */
export const paginateCustomers = (
	customers: CustomerData[],
	page: number,
	pageSize: number
): CustomerData[] => {
	const startIndex = (page - 1) * pageSize;
	return customers.slice(startIndex, startIndex + pageSize);
};

