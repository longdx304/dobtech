'use client';
import { Card } from '@/components/Card';
import { CartWithCheckoutStep } from '@/types/medusa';
import { Customer } from '@medusajs/medusa';
import React, { useState } from 'react';
import EmptyCartMessage from '../components/empty-cart-message';

import ItemsTemplate from './items';
import Summary from './summary';

const Overview = ({
	cart,
	customer,
	className,
}: {
	cart: CartWithCheckoutStep | null;
	customer: Omit<Customer, 'password_hash'> | null;
	className?: string;
}) => {
	const [selectedItems, setSelectedItems] = useState<string[]>([]);

	const handleItemSelectionChange = (selectedRowKeys: React.Key[]) => {
		setSelectedItems(selectedRowKeys as string[]);
	};

	return (
		<div className={className} data-testid="cart-container">
			{cart?.items.length ? (
				<div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-x-8">
					<Card className="flex flex-col bg-white pb-6 gap-y-6">
						<ItemsTemplate
							region={cart?.region}
							items={cart?.items}
							selectedItems={selectedItems as any}
							onItemSelectionChange={handleItemSelectionChange}
							setSelectedItems={setSelectedItems as any}
						/>
					</Card>
					<Card className="h-fit sticky top-16">
						{cart && cart.region && (
							<>
								<div className="bg-white">
									<Summary cart={cart} selectedItems={selectedItems} />
								</div>
							</>
						)}
					</Card>
				</div>
			) : (
				<div>
					<EmptyCartMessage />
				</div>
			)}
		</div>
	);
};

export default Overview;
