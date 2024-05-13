import { useState } from 'react';

const useAdminAction = () => {
	const [query, setQuery] = useState('');
	return {
		query,
		setQuery,
	};
};
export default useAdminAction;
