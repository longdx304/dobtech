'use client';
import React, { useEffect, useState } from 'react';
import SignInPrompt from '../components/sign-in-prompt';
import ItemsTemplate from './items';
import Summary from './summary';
import EmptyCartMessage from '../components/empty-cart-message';
import { CartWithCheckoutStep } from '@/types/medusa';
import { Customer } from '@medusajs/medusa';

const Overview = ({
	cart,
	customer,
  className,
}: {
	cart: CartWithCheckoutStep | null;
	customer: Omit<Customer, 'password_hash'> | null;
  className?: string;
}) => {
	const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

	useEffect(() => {
		if (cart?.items) {
			setSelectedItems(new Set(cart.items.map((item) => item.id)));
		}
	}, [cart?.items]);

	const handleItemSelectionChange = (itemId: string, isSelected: boolean) => {
		setSelectedItems((prevSelectedItems) => {
			const updatedSelectedItems = new Set(prevSelectedItems);
			if (isSelected) {
				updatedSelectedItems.add(itemId);
			} else {
				updatedSelectedItems.delete(itemId);
			}
			return updatedSelectedItems;
		});
	};

	return (
		<div className={className} data-testid="cart-container">
			{cart?.items.length ? (
				<div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-x-28">
					<div className="flex flex-col bg-white pb-6 gap-y-6">
						{!customer && (
							<>
								<SignInPrompt />
							</>
						)}
						<ItemsTemplate
							region={cart?.region}
							items={cart?.items}
							selectedItems={selectedItems}
							onItemSelectionChange={handleItemSelectionChange}
						/>
					</div>
					<div className="relative">
						<div className="flex flex-col gap-y-8 sticky top-12">
							{cart && cart.region && (
								<>
									<div className="bg-white">
										<Summary cart={cart} selectedItems={selectedItems} />
									</div>
								</>
							)}
						</div>
					</div>
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
