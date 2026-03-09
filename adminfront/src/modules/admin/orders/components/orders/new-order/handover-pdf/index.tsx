/* eslint-disable jsx-a11y/alt-text */

import {
	Document,
	Font,
	Page,
	pdf,
	StyleSheet,
	Text,
	View,
} from '@react-pdf/renderer';
import dayjs from 'dayjs';
import { FC } from 'react';
import { pdfOrderRes } from '..';
import { formatNumber } from '@/lib/utils';

Font.register({
	family: 'Roboto',
	src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
});

const styles = StyleSheet.create({
	page: {
		padding: 30,
		fontFamily: 'Roboto',
		fontSize: 10,
		lineHeight: 1.5,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 20,
		paddingBottom: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#dddddd',
	},
	section: {
		marginBottom: 15,
		paddingBottom: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#eeeeee',
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 10,
	},
	column: {
		flex: 1,
		marginRight: 10,
	},
	title: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 5,
	},
	label: {
		fontSize: 9,
		fontWeight: 'bold',
		color: '#666666',
		marginBottom: 3,
	},
	text: {
		fontSize: 10,
	},
	tableHeader: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: '#dddddd',
		paddingBottom: 5,
		marginBottom: 5,
	},
	tableRow: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: '#eeeeee',
		paddingVertical: 5,
		alignItems: 'center',
	},
	tableCell: {
		flex: 1,
		fontSize: 9,
		paddingHorizontal: 5,
	},
	productCell: {
		flex: 3,
		flexDirection: 'column',
		textAlign: 'left',
	},
	signatureSection: {
		marginTop: 30,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	signatureBox: {
		flex: 1,
		alignItems: 'center',
		paddingHorizontal: 10,
	},
	signatureLabel: {
		fontSize: 10,
		fontWeight: 'bold',
		marginBottom: 50,
		textAlign: 'center',
	},
	signatureLine: {
		borderTopWidth: 1,
		borderTopColor: '#333333',
		width: '100%',
		marginTop: 5,
	},
	signatureNote: {
		fontSize: 8,
		color: '#999999',
		textAlign: 'center',
		marginTop: 3,
	},
});

interface HandoverPDFProps {
	order: pdfOrderRes;
}

const HandoverPDFDocument: FC<HandoverPDFProps> = ({ order }) => {
	if (!order) return null;

	const sortedItems = [...order.lineItems].sort((a: any, b: any) =>
		(a.sku || '').localeCompare(b.sku || '')
	);

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				<View style={styles.header}>
					<View>
						<Text style={styles.title}>Biên Bản Bàn Giao</Text>
					</View>
					<View>
						<Text style={styles.text}>
							Ngày: {dayjs(new Date()).format('DD/MM/YYYY')}
						</Text>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.title}>Thông Tin Khách Hàng</Text>
					<View style={styles.row}>
						<View style={styles.column}>
							<Text style={styles.label}>Tên Khách Hàng</Text>
							<Text style={styles.text}>{`${order.customer?.last_name} ${order.customer?.first_name}`}</Text>
						</View>
						<View style={styles.column}>
							<Text style={styles.label}>Địa Chỉ</Text>
							<Text style={styles.text}>{order.address}</Text>
						</View>
					</View>
					<View style={styles.row}>
						<View style={styles.column}>
							<Text style={styles.label}>Email Khách Hàng</Text>
							<Text style={styles.text}>{order.customer?.email}</Text>
						</View>
						<View style={styles.column}>
							<Text style={styles.label}>Số Điện Thoại</Text>
							<Text style={styles.text}>{order.customer?.phone}</Text>
						</View>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.title}>Thông Tin Đơn Hàng</Text>
					<View style={styles.row}>
						<View style={styles.column}>
							<Text style={styles.label}>Đặt Hàng Bởi</Text>
							<Text style={styles.text}>{order.email}</Text>
						</View>
						<View style={styles.column}>
							<Text style={styles.label}>Người Dùng</Text>
							<Text style={styles.text}>
								{order.user?.first_name} {order.user?.last_name}
							</Text>
						</View>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.title}>Sản Phẩm Bàn Giao</Text>
					<View style={styles.tableHeader}>
						<Text style={styles.tableCell}>#</Text>
						<Text style={[styles.tableCell, { flex: 3 }]}>Sản Phẩm</Text>
						<Text style={styles.tableCell}>Số Lượng</Text>
					</View>

					{sortedItems.map((item, index) => (
						<View key={index} style={styles.tableRow}>
							<Text style={styles.tableCell}>{index + 1}</Text>
							<View style={[styles.tableCell, styles.productCell]}>
								<Text>{item.title}</Text>
							</View>
							<Text style={styles.tableCell}>{formatNumber(item.quantity)}</Text>
						</View>
					))}

					<View style={styles.tableRow}>
						<Text style={styles.tableCell}>{'-'}</Text>
						<View style={[styles.tableCell, styles.productCell]}>
							<Text>{'-'}</Text>
						</View>
						<Text style={styles.tableCell}>
							{formatNumber(order.totalQuantity)}
						</Text>
					</View>
				</View>

				{/* Signature rows */}
				<View style={styles.signatureSection}>
					<View style={styles.signatureBox}>
						<Text style={styles.signatureLabel}>Người Lập Phiếu</Text>
						<View style={styles.signatureLine} />
						<Text style={styles.signatureNote}>(Ký, ghi rõ họ tên)</Text>
					</View>
					<View style={styles.signatureBox}>
						<Text style={styles.signatureLabel}>Người Nhận</Text>
						<View style={styles.signatureLine} />
						<Text style={styles.signatureNote}>(Ký, ghi rõ họ tên)</Text>
					</View>
					<View style={styles.signatureBox}>
						<Text style={styles.signatureLabel}>Người Giao</Text>
						<View style={styles.signatureLine} />
						<Text style={styles.signatureNote}>(Ký, ghi rõ họ tên)</Text>
					</View>
				</View>
			</Page>
		</Document>
	);
};

export const generateHandoverPdfBlob = async (order: pdfOrderRes) => {
	const blob = await pdf(<HandoverPDFDocument order={order} />).toBlob();
	return blob;
};

export default HandoverPDFDocument;
