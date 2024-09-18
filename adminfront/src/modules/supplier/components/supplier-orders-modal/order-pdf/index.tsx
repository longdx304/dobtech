/* eslint-disable jsx-a11y/alt-text */

import { formatDate } from '@/utils/get-relative-time';
import {
	Document,
	Page,
	pdf,
	StyleSheet,
	Text,
	View,
} from '@react-pdf/renderer';
import { FC } from 'react';
import { pdfOrderRes } from '..';

// Styles for PDF
const styles = StyleSheet.create({
	page: {
		padding: 30,
		fontFamily: 'Helvetica',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	subtitle: {
		fontSize: 14,
		color: '#555',
	},
	section: {
		margin: 10,
		marginBottom: 15,
	},
	row: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: '#ccc',
		paddingBottom: 5,
		marginBottom: 5,
	},
	column: {
		flex: 1,
	},
	label: {
		fontSize: 10,
		color: '#555',
		marginBottom: 3,
	},
	text: {
		fontSize: 12,
	},
	tableHeader: {
		flexDirection: 'row',
		borderBottomWidth: 2,
		borderBottomColor: '#000',
		paddingBottom: 5,
		marginBottom: 5,
		fontWeight: 'bold',
	},
	tableRow: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: '#ccc',
		paddingBottom: 5,
		marginBottom: 5,
	},
	tableCell: {
		flex: 1,
		fontSize: 10,
	},

	total: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		marginTop: 10,
	},
	totalLabel: {
		fontSize: 12,
		fontWeight: 'bold',
		marginRight: 15,
	},
	totalAmount: {
		fontSize: 12,
		fontWeight: 'bold',
	},
});

interface OrderPDFProps {
	order: pdfOrderRes;
	variants: any;
}

const OrderPDFDocument: FC<OrderPDFProps> = ({ order, variants }) => {
	const total = order.lineItems.reduce(
		(sum, item) => sum + item.quantity * (item.unit_price || 0),
		0
	);

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				<View style={styles.header}>
					<View>
						<Text style={styles.title}>Purchase Order</Text>
					</View>
					<View>
						<Text style={styles.text}>Date: {formatDate(new Date())}</Text>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.title}>Supplier Details</Text>
					<View style={styles.row}>
						<View style={styles.column}>
							<Text style={styles.label}>Supplier Name</Text>
							<Text style={styles.text}>{order.supplier?.supplier_name}</Text>
						</View>
						<View style={styles.column}>
							<Text style={styles.label}>Address</Text>
							<Text style={styles.text}>{order.supplier?.address}</Text>
						</View>
					</View>
					<View style={styles.row}>
						<View style={styles.column}>
							<Text style={styles.label}>Supplier Email</Text>
							<Text style={styles.text}>{order.supplier?.email}</Text>
						</View>
						<View style={styles.column}>
							<Text style={styles.label}>Phone Number</Text>
							<Text style={styles.text}>{order.supplier?.phone}</Text>
						</View>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.title}>Order Details</Text>
					<View style={styles.row}>
						<View style={styles.column}>
							<Text style={styles.label}>Ordered By</Text>
							<Text style={styles.text}>{order.email}</Text>
						</View>
						<View style={styles.column}>
							<Text style={styles.label}>User</Text>
							<Text style={styles.text}>
								{order.user?.first_name} {order.user?.last_name}
							</Text>
						</View>
					</View>
					{/* <View style={styles.row}>
						<View style={styles.column}>
							<Text style={styles.label}>Estimated Production Time</Text>
							<Text style={styles.text}>
								{formatDate(order.estimated_production_time)}
							</Text>
						</View>
						<View style={styles.column}>
							<Text style={styles.label}>Settlement Time</Text>
							<Text style={styles.text}>
								{formatDate(order.settlement_time)}
							</Text>
						</View>
					</View> */}
				</View>

				<View style={styles.section}>
					<Text style={styles.title}>Order Items</Text>
					<View style={styles.tableHeader}>
						<Text style={[styles.tableCell, { flex: 2 }]}>Product</Text>
						<Text style={styles.tableCell}>Quantity</Text>
						<Text style={styles.tableCell}>Unit Price</Text>
						<Text style={styles.tableCell}>Total</Text>
					</View>

					{order.lineItems.map((item, index) => {
						// Find the variant and product for this line item
						const variant = variants?.find((v: any) => v.id === item.variantId);
						const productTitle = variant
							? variant.product.title
							: 'Unknown Product';
						const variantTitle = variant ? variant.title : 'Unknown Variant';

						return (
							<View key={index} style={styles.tableRow}>
								<Text style={[styles.tableCell, { flex: 2 }]}>
									{productTitle}
									{'\n'}
									{variantTitle}
								</Text>
								<Text style={styles.tableCell}>{item.quantity}</Text>
								<Text style={styles.tableCell}>
									{item.unit_price?.toLocaleString('vi-VN')} VND
								</Text>
								<Text style={styles.tableCell}>
									{(item.quantity * (item.unit_price || 0)).toLocaleString(
										'vi-VN'
									)}{' '}
									VND
								</Text>
							</View>
						);
					})}
					<View style={styles.total}>
						<Text style={styles.totalLabel}>Total:</Text>
						<Text style={styles.totalAmount}>
							{total.toLocaleString('vi-VN')} VND
						</Text>
					</View>
				</View>
			</Page>
		</Document>
	);
};

export const OrderPDF: FC<OrderPDFProps> = (props) => {
	return <OrderPDFDocument {...props} />;
};

export const generatePdfBlob = async (
	order: pdfOrderRes,
	variants: any
) => {
	const blob = await pdf(
		<OrderPDFDocument order={order} variants={variants} />
	).toBlob();
	return blob;
};

export default OrderPDF;
