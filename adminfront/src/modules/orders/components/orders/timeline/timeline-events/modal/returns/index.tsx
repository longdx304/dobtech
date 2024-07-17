// @ts-nocheck
// !check this file
import {
	AdminGetVariantsVariantInventoryRes,
	AdminPostOrdersOrderReturnsReq,
	LevelWithAvailability,
	Order,
	LineItem as RawLineItem,
} from '@medusajs/medusa';
import { message } from 'antd';
import {
	useAdminRequestReturn,
	useAdminShippingOptions,
	useAdminStockLocations,
	useMedusa,
} from 'medusa-react';
import React, { useEffect, useState } from 'react';

import { Modal } from '@/components/Modal';
import { Text, Title } from '@/components/Typography';
import { useFeatureFlag } from '@/lib/providers/feature-flag-provider';
import { getErrorMessage } from '@/lib/utils';
import { getAllReturnableItems } from '@/modules/orders/components/orders/utils/create-filtering';
import { Option } from '@/types/shared';
import { removeFalsy } from '@/utils/remove-nullish';
import RMASelectProductTable from '../rma-select-product-table';

type ReturnMenuProps = {
	order: Order;
	state: boolean;
	onClose: () => void;
};

type LineItem = Omit<RawLineItem, 'beforeInsert'>;

const ReturnMenu: React.FC<ReturnMenuProps> = ({ order, state, onClose }) => {
	const { client } = useMedusa();
	const { isFeatureEnabled } = useFeatureFlag();
	const isLocationFulfillmentEnabled =
		isFeatureEnabled('inventoryService') &&
		isFeatureEnabled('stockLocationService');

	const [submitting, setSubmitting] = useState(false);
	const [refundEdited, setRefundEdited] = useState(false);
	const [refundable, setRefundable] = useState(0);
	const [refundAmount, setRefundAmount] = useState(0);
	const [selectedLocation, setSelectedLocation] = useState<{
		value: string;
		label: string;
	} | null>(null);
	const [toReturn, setToReturn] = useState<
		Record<string, { quantity: number }>
	>({});
	const [useCustomShippingPrice, setUseCustomShippingPrice] = useState(false);

	const [shippingPrice, setShippingPrice] = useState<number>();
	const [shippingMethod, setShippingMethod] = useState<Option | null>(null);

	const [allItems, setAllItems] = useState<Omit<LineItem, 'beforeInsert'>[]>(
		[]
	);

	const { stock_locations, refetch } = useAdminStockLocations(
		{},
		{
			enabled: isLocationFulfillmentEnabled,
		}
	);

	React.useEffect(() => {
		if (isLocationFulfillmentEnabled) {
			refetch();
		}
	}, [isLocationFulfillmentEnabled, refetch]);

	const requestReturnOrder = useAdminRequestReturn(order.id);

	useEffect(() => {
		if (order) {
			setAllItems(getAllReturnableItems(order, false));
		}
	}, [order]);

	const itemMap = React.useMemo(() => {
		return new Map<string, LineItem>(order.items.map((i) => [i.id, i]));
	}, [order.items]);

	const [inventoryMap, setInventoryMap] = useState<
		Map<string, LevelWithAvailability[]>
	>(new Map());

	React.useEffect(() => {
		const getInventoryMap = async () => {
			if (!allItems.length || !isLocationFulfillmentEnabled) {
				return new Map();
			}
			const itemInventoryList = await Promise.all(
				allItems.map(async (item) => {
					if (!item.variant_id) {
						return undefined;
					}
					return await client.admin.variants.getInventory(item.variant_id);
				})
			);

			return new Map(
				itemInventoryList
					.filter((it) => !!it)
					.map((item) => {
						const { variant } = item as AdminGetVariantsVariantInventoryRes;
						return [variant.id, variant.inventory[0]?.location_levels];
					})
			);
		};

		getInventoryMap().then((map) => {
			setInventoryMap(map);
		});
	}, [allItems, client.admin.variants, isLocationFulfillmentEnabled]);

	const locationsHasInventoryLevels = React.useMemo(() => {
		return Object.entries(toReturn)
			.map(([itemId]) => {
				const item = itemMap.get(itemId);
				if (!item?.variant_id) {
					return true;
				}
				const hasInventoryLevel = inventoryMap
					.get(item.variant_id)
					?.find((l) => l.location_id === selectedLocation?.value);

				if (!hasInventoryLevel && selectedLocation?.value) {
					return false;
				}
				return true;
			})
			.every(Boolean);
	}, [toReturn, itemMap, selectedLocation?.value, inventoryMap]);

	const { isLoading: shippingLoading, shipping_options: shippingOptions } =
		useAdminShippingOptions({
			region_id: order.region_id,
			is_return: true,
		});

	useEffect(() => {
		const items = Object.keys(toReturn)
			.map((t) => allItems.find((i) => i.id === t))
			.filter((i) => typeof i !== 'undefined') as LineItem[];

		const itemTotal = items.reduce((acc: number, curr: LineItem): number => {
			const unitRefundable =
				(curr.refundable || 0) / (curr.quantity - curr.returned_quantity);

			return acc + unitRefundable * toReturn[curr.id].quantity;
		}, 0);

		const total = itemTotal - (shippingPrice || 0);

		setRefundable(total);

		setRefundAmount(total);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [toReturn, shippingPrice]);

	const onSubmit = async () => {
		const items = Object.entries(toReturn).map(([key, value]) => {
			const toSet = {
				reason_id: value.reason?.value.id,
				...value,
			};
			delete toSet.reason;
			const clean = removeFalsy(toSet);
			return {
				item_id: key,
				...(clean as { quantity: number }),
			};
		});

		const data: AdminPostOrdersOrderReturnsReq = {
			items,
			refund: Math.round(refundAmount),
			no_notification: undefined,
		};

		if (selectedLocation && isLocationFulfillmentEnabled) {
			data.location_id = selectedLocation.value;
		}

		if (shippingMethod) {
			const taxRate = shippingMethod.tax_rates.reduce((acc, curr) => {
				return acc + curr.rate / 100;
			}, 0);

			data.return_shipping = {
				option_id: shippingMethod.value,
				price: shippingPrice ? Math.round(shippingPrice / (1 + taxRate)) : 0,
			};
		}

		setSubmitting(true);
		return requestReturnOrder
			.mutateAsync(data)
			.then(() => onClose())
			.then(() => {
				message.success('Đã yêu cầu trả lại đơn hàng');
			})
			.catch((error) => message.error(getErrorMessage(error)))
			.finally(() => setSubmitting(false));
	};

	const handleRefundUpdated = (value: any) => {
		if (value < order.refundable_amount && value >= 0) {
			setRefundAmount(value);
		}
	};

	const handleShippingSelected = (selectedItem: any) => {
		setShippingMethod(selectedItem);
		const method = shippingOptions?.find((o) => selectedItem.value === o.id);

		if (method) {
			setShippingPrice(method.price_incl_tax);
		}
	};

	useEffect(() => {
		if (!useCustomShippingPrice && shippingMethod) {
			const method = shippingOptions?.find(
				(o) => shippingMethod.value === o.id
			);

			if (method) {
				setShippingPrice(method.price_incl_tax);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [useCustomShippingPrice, shippingMethod]);

	const handleUpdateShippingPrice = (value: any) => {
		if (value >= 0) {
			setShippingPrice(value);
		}
	};

	return (
		<Modal
			open={state}
			handleOk={onSubmit}
			// isLoading={isLoading}
			// disabled={isLoading}
			handleCancel={onClose}
			width={800}
		>
			<Title level={4} className="text-center mb-2">
				{'Yêu cầu trả lại'}
			</Title>
			<div>
				<Text strong className="font-medium mb-2">
					{'Các mục cần trả lại'}
				</Text>
				<RMASelectProductTable
					order={order}
					allItems={allItems}
					toReturn={toReturn}
					setToReturn={(items) => setToReturn(items)}
				/>
			</div>
			{/* <Modal.Content>
          <div className="mb-7">
            <h3 className="inter-base-semibold">
              {t("returns-items-to-return", "Items to return")}
            </h3>
            <RMASelectProductTable
              order={order}
              allItems={allItems}
              toReturn={toReturn}
              setToReturn={(items) => setToReturn(items)}
            />
          </div>

          {isLocationFulfillmentEnabled && (
            <div className="mb-8">
              <h3 className="inter-base-semibold ">Location</h3>
              <p className="inter-base-regular text-grey-50">
                {t(
                  "returns-choose-which-location-you-want-to-return-the-items-to",
                  "Choose which location you want to return the items to."
                )}
              </p>
              <Select
                className="mt-2"
                placeholder={t(
                  "returns-select-location-to-return-to",
                  "Select Location to Return to"
                )}
                value={selectedLocation}
                isMulti={false}
                onChange={setSelectedLocation}
                options={
                  stock_locations?.map((sl: StockLocationDTO) => ({
                    label: sl.name,
                    value: sl.id,
                  })) || []
                }
              />
              {!locationsHasInventoryLevels && (
                <div className="bg-orange-10 border-orange-20 rounded-rounded text-yellow-60 gap-x-base mt-4 flex border p-4">
                  <div className="text-orange-40">
                    <WarningCircleIcon size={20} fillType="solid" />
                  </div>
                  <div>
                    {t(
                      "returns-selected-location-has-no-inventory-levels",
                      "The selected location does not have inventory levels for the selected items. The return can be requested but can't be received until an inventory level is created for the selected location."
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div>
            <h3 className="inter-base-semibold ">
              {t("returns-shipping", "Shipping")}
            </h3>
            <p className="inter-base-regular text-grey-50">
              {t(
                "returns-choose-retur,-shipping-method",
                "Choose which shipping method you want to use for this return."
              )}
            </p>
            {shippingLoading ? (
              <div className="flex justify-center">
                <Spinner size="medium" variant="secondary" />
              </div>
            ) : (
              <Select
                className="mt-2"
                placeholder="Add a shipping method"
                value={shippingMethod}
                onChange={handleShippingSelected}
                options={
                  shippingOptions?.map((o) => ({
                    label: o.name,
                    value: o.id,
                    tax_rates: o.tax_rates,
                  })) || []
                }
              />
            )}
            {shippingMethod && (
              <RMAShippingPrice
                inclTax
                useCustomShippingPrice={useCustomShippingPrice}
                shippingPrice={shippingPrice}
                currencyCode={order.currency_code}
                updateShippingPrice={handleUpdateShippingPrice}
                setUseCustomShippingPrice={setUseCustomShippingPrice}
              />
            )}
          </div>

          {refundable >= 0 && (
            <div className="mt-10">
              {!useCustomShippingPrice && shippingMethod && (
                <div className="inter-small-regular mb-4 flex justify-between">
                  <span>{t("returns-shipping", "Shipping")}</span>
                  <div>
                    {displayAmount(order.currency_code, shippingPrice || 0)}{" "}
                    <span className="text-grey-40 ml-3">
                      {order.currency_code.toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
              <div className="inter-base-semibold flex w-full justify-between">
                <span>{t("returns-total-refund", "Total Refund")}</span>
                <div className="flex items-center">
                  {!refundEdited && (
                    <>
                      <span
                        className="text-grey-40 mr-2 cursor-pointer"
                        onClick={() => setRefundEdited(true)}
                      >
                        <EditIcon size={20} />{" "}
                      </span>
                      {`${displayAmount(
                        order.currency_code,
                        refundAmount
                      )} ${order.currency_code.toUpperCase()}`}
                    </>
                  )}
                </div>
              </div>
              {refundEdited && (
                <CurrencyInput.Root
                  className="mt-2"
                  size="small"
                  currentCurrency={order.currency_code}
                  readOnly
                >
                  <CurrencyInput.Amount
                    label={t("returns-amount", "Amount")}
                    amount={refundAmount}
                    onChange={handleRefundUpdated}
                  />
                </CurrencyInput.Root>
              )}
            </div>
          )}
        </Modal.Content>
        <Modal.Footer>
          <div className="flex w-full justify-between">
            <div className="gap-x-xsmall flex">
              <Button
                onClick={() => onDismiss()}
                className="w-[112px]"
                type="submit"
                size="small"
                variant="ghost"
              >
                {t("returns-back", "Back")}
              </Button>
              <Button
                onClick={onSubmit}
                loading={submitting}
                className="w-[112px]"
                type="submit"
                size="small"
                variant="primary"
                disabled={Object.keys(toReturn).length === 0}
              >
                {t("returns-submit", "Submit")}
              </Button>
            </div>
          </div>
        </Modal.Footer> */}
		</Modal>
	);
};

export default ReturnMenu;
