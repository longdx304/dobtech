'use client';
import { useAdminProduct } from "medusa-react"
import { Row, Col } from 'antd';
import { ProductCategory } from "@medusajs/medusa"

import BackToProducts from './components/BackToProducts';
import Images from './components/Images';
import GeneralInfo from './components/GeneralInfo';
import VariantsInfo from './components/VariantsInfo';
import AttributesInfo from './components/AttributesInfo';

interface Props {
	id: string;
	productCategories: ProductCategory;
}

export default function ProductDetail({ id , productCategories}: Props) {
	const { product, status, error, isLoading } = useAdminProduct(id || "")

	return (
		<Row gutter={[16,16]} className="mb-12">
			<Col span={24}>
				<BackToProducts />
			</Col>
			<Col span={24}>
				<Images product={product} loadingProduct={isLoading} />
			</Col>
			<Col span={24}>
				<GeneralInfo product={product} loadingProduct={isLoading} productCategories={productCategories} />
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
