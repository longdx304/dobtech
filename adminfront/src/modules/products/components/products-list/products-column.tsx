import type { TableProps } from 'antd';

const productsColumns: TableProps<any>['columns'] = [
  {
    title: 'Tên sản phẩm',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Giá bán',
    dataIndex: 'price',
    key: 'price',
  },
];

export default productsColumns;
