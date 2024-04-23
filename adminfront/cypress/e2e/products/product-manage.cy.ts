import { clear } from 'console';

describe('template spec', () => {
	const productName = 'product test 1';
	const productNameUpdated = 'product test 2';
	const color = 'red';
	const colorUpdated = 'blue';
	const quantity = '10';
	const quantityUpdated = '20';
	const price = '10000';
	const priceUpdated = '20000';
	const inventoryQuantity = '100';
	const inventoryQuantityUpdated = '200';
	const sizes = ['S', 'M', 'L'];
	const sizesUpdated = ['S', 'M'];

	beforeEach(() => {
		cy.login('admin@test.com', '123456'), cy.wait(1000), cy.visit('/products');
	});

	it('should show new product when successfully created product', () => {
		cy.findByTestId('btnCreateProduct').should('exist').click();
		cy.findByTestId('title').should('exist').type(productName);
		cy.findByTestId('sizes').should('exist').type(sizes.join(','));
		cy.findByTestId('color').should('exist').type(color);
		cy.findByTestId('quantity').should('exist').type(quantity);
		cy.findByTestId('price').should('exist').type(price);
		cy.findByTestId('inventoryQuantity')
			.should('exist')
			.type(inventoryQuantity);
		cy.findByTestId('submitButton').should('exist').click();

		cy.wait(1000);
		cy.findByText('Thêm sản phẩm thành công').should('be.visible');
	});

	it('should show update product when successfully update product', () => {
		cy.contains('td', productName)
			.parent()
			.findByTestId('editProduct')
			.should('exist')
			.click();
		cy.findByTestId('title').should('exist').clear().type(productNameUpdated);
		// cy.findByTestId('sizes')
		// 	.should('exist')
		// 	.clear()
		// 	.type(sizesUpdated.join(','));
		cy.findByTestId('color').should('exist').clear().type(colorUpdated);
		cy.findByTestId('quantity').should('exist').clear().type(quantityUpdated);
		cy.findByTestId('price').should('exist').clear().type(priceUpdated);
		cy.findByTestId('inventoryQuantity')
			.should('exist')
			.clear()
			.type(inventoryQuantityUpdated);
		cy.findByTestId('submitButton').should('exist').click();

		cy.wait(1000);
		cy.findByText('Cập nhật sản phẩm thành công').should('be.visible');
	});

	it('should show remove product when successfully delete product', () => {
		cy.contains('td', productName)
			.parent()
			.findByTestId('deleteProduct')
			.should('exist')
			.click();

		cy.findByText('Đồng ý').should('exist').click();
		cy.wait(1000);
		cy.findByText('Xoá sản phẩm thành công!').should('be.visible');
	});
});
