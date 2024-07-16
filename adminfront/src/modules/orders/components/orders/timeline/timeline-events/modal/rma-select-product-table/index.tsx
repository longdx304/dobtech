import { LineItem, Order } from "@medusajs/medusa"
import clsx from "clsx"
import React, { Fragment, useState } from "react"
// import Medusa from "../../../services/api"
// import { isLineItemCanceled } from "../../../utils/is-line-item"
import { formatAmountWithSymbol } from "@/utils/prices"
import { Button } from "@/components/Button"
import { Table } from '@/components/Table';
import productsColumns from './products-column';

type RMASelectProductTableProps = {
  order: Omit<Order, "beforeInsert">
  allItems: Omit<LineItem, "beforeInsert">[]
  toReturn: any
  setToReturn: (items: any) => void
  customReturnOptions?: any[]
  imagesOnReturns?: any
  isSwapOrClaim?: boolean
}

const RMASelectProductTable: React.FC<RMASelectProductTableProps> = ({
  order,
  allItems,
  toReturn,
  customReturnOptions = undefined,
  imagesOnReturns = false,
  setToReturn,
  isSwapOrClaim = false,
}) => {
	console.log('allItems', allItems)
	const [selectedVariants, setSelectedVariants] = useState<string[]>(
		[]
	);

	const handleRowSelectionChange = (selectedRowKeys: React.Key[]) => {
		setSelectedVariants(selectedRowKeys);
	};
  // const handleQuantity = (change, item) => {
  //   if (
  //     (item.quantity - item.returned_quantity === toReturn[item.id].quantity &&
  //       change > 0) ||
  //     (toReturn[item.id].quantity === 1 && change < 0)
  //   ) {
  //     return
  //   }

  //   const newReturns = {
  //     ...toReturn,
  //     [item.id]: {
  //       ...toReturn[item.id],
  //       quantity: (toReturn[item.id]?.quantity || 0) + change,
  //     },
  //   }

  //   setToReturn(newReturns)
  // }

  // const handleReturnToggle = (item) => {
  //   const id = item.id

  //   const newReturns = { ...toReturn }

  //   if (id in toReturn) {
  //     delete newReturns[id]
  //   } else {
  //     newReturns[id] = {
  //       images: imagesOnReturns ? [] : null,
  //       reason: null,
  //       note: "",
  //       quantity: item.quantity - item.returned_quantity,
  //     }
  //   }

  //   setToReturn(newReturns)
  // }

  // const handleAddImages = async (files) => {
  //   return Medusa.uploads
  //     .create(files)
  //     .then(({ data }) => data.uploads.map(({ url }) => url))
  // }

  // const setReturnReason = (reason, note, files, id) => {
  //   let newReturns = {}
  //   if (imagesOnReturns && files?.length) {
  //     handleAddImages(files).then((res) => {
  //       newReturns = {
  //         ...toReturn,
  //         [id]: {
  //           ...toReturn[id],
  //           reason: reason,
  //           note: note,
  //           images: [...(toReturn[id].images || []), ...res],
  //         },
  //       }
  //       setToReturn(newReturns)
  //     })
  //   } else {
  //     newReturns = {
  //       ...toReturn,
  //       [id]: {
  //         ...toReturn[id],
  //         reason: reason,
  //         note: note,
  //       },
  //     }

  //     setToReturn(newReturns)
  //   }
  // }

	const columns = productsColumns({ currencyCode: order.currency_code });

  return (
    <Table
			rowSelection={{
				type: 'checkbox',
				selectedRowKeys: selectedVariants,
				onChange: handleRowSelectionChange,
				preserveSelectedRowKeys: true,
				// getCheckboxProps: (record) => ({
				// 	disabled: productIds?.includes(record.id),
				// }),
			}}
			// loading={isLoading}
			columns={columns as any}
			dataSource={allItems ?? []}
			rowKey="id"
			pagination={false}
			// scroll={{ x: 700 }}
		/>
  )
}

export default RMASelectProductTable
