'use client';
import { useAdminProduct } from "medusa-react"
import { Row, Col } from 'antd';

import BackToProducts from './components/BackToProducts';
import Images from './components/Images';
import GeneralInfo from './components/GeneralInfo';
import VariantsInfo from './components/VariantsInfo';
import AttributesInfo from './components/AttributesInfo';

interface Props {
	id: string;
}

export default function ProductDetail({ id }: Props) {
	const { product, status, error, isLoading } = useAdminProduct(id || "")
	console.log(product);
	return (
		<Row gutter={[16,16]} className="mb-12">
			<Col span={24}>
				<BackToProducts />
			</Col>
			<Col span={24}>
				<Images product={product} loadingProduct={isLoading} />
			</Col>
			<Col span={24}>
				<GeneralInfo product={product} loadingProduct={isLoading} />
			</Col>
			<Col span={24}>
				<VariantsInfo product={product} loadingProduct={isLoading} />
			</Col>
			<Col span={24}>
				<AttributesInfo product={product} loadingProduct={isLoading} />
			</Col>
		</Row>
	);
}
