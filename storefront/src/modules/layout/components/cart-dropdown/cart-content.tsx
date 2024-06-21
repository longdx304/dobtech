import { Button } from '@/components/Button';
import { Text, Title } from '@/components/Typography';
import DeleteButton from '@/modules/common/components/delete-button';
import LineItemPrice from '@/modules/common/components/line-item-price';
import LocalizedClientLink from '@/modules/common/components/localized-client-link';
import Thumbnail from '@/modules/products/components/thumbnail';
import { Cart } from '@medusajs/medusa';
import Image from 'next/image';

const CartContent = ({
	cart: cartState,
}: {
	cart?: Omit<Cart, 'beforeInsert' | 'afterLoad'> | null;
}) => {
	console.log('cart', cartState)
	return (
		<div className="w-[420px]">
			{!!cartState.items.length && (
				<div className="flex items-center justify-center py-4">
					<Title className="text-xl">Sản phẩm mới thêm</Title>
				</div>
			)}
			{cartState && cartState.items?.length ? (
				<>
					<div className="overflow-y-scroll max-h-[402px] px-4 grid grid-cols-1 gap-y-8 p-px">
						{cartState.items
							.sort((a, b) => {
								return a.created_at > b.created_at ? -1 : 1;
							})
							.map((item) => (
								<div
									className="grid grid-cols-[auto_1fr] gap-x-4"
									key={item.id}
									data-testid="cart-item"
								>
									<LocalizedClientLink
										href={`products/${item.variant.product.handle}`}
										className="w-16 h-16"
									>
										<Thumbnail
											thumbnail={item.thumbnail}
											className="aspect-square"
										/>
									</LocalizedClientLink>
									<div className="flex flex-col justify-between flex-1">
										<div className="flex flex-col flex-1">
											<div className="flex items-center justify-between">
												<div className="flex flex-col overflow-ellipsis whitespace-nowrap w-[180px]">
													<Text className="text-md overflow-hidden text-ellipsis">
														<LocalizedClientLink
															href={`products/${item.variant.product.handle}`}
															data-testid="product-link"
															className="text-black"
														>
															{item.title}
														</LocalizedClientLink>
													</Text>
												</div>
												<div className="flex justify-end">
													<LineItemPrice
														region={cartState.region}
														item={item}
														style="tight"
													/>
												</div>
											</div>
										</div>
										<div className="flex justify-start items-center text-xs">
											<span
											>
												Phân loại hàng: {item.variant.options.map(option => option.value).join('/')}
											</span>
										</div>
										<div className="flex justify-between items-center text-xs">
											<span
												data-testid="cart-item-quantity"
												data-value={item.quantity}
											>
												Số lượng: {item.quantity}
											</span>
											<DeleteButton
												id={item.id}
												className="mt-1 bg-transparent"
												data-testid="cart-item-remove-button"
											/>
										</div>
									</div>
								</div>
							))}
					</div>
					<div className="p-4 flex flex-col gap-y-4 text-sm">
						<LocalizedClientLink href="cart" passHref>
							<Button
								className="w-full"
								size="large"
								data-testid="go-to-cart-button"
							>
								Xem Giỏ hàng
							</Button>
						</LocalizedClientLink>
					</div>
				</>
			) : (
				<EmptyCart />
			)}
		</div>
	);
};

export default CartContent;

const EmptyCart = () => {
	return (
		<div className="flex pt-8 pb-12 flex-col gap-y-2 items-center justify-center">
			<Image
				src={'/images/empty-cart.png'}
				alt="Empty cart"
				width={150}
				height={150}
			/>
			<Text className="text-sm text-gray-400">Giỏ hàng của bạn trống</Text>
		</div>
	);
};
