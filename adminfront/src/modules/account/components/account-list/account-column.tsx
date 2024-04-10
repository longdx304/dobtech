import type { TableProps } from 'antd';

const accountColumns: TableProps<any>['columns'] = [
  {
    title: 'Avatar',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Thông tin',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Trạng thái',
    key: 'action',
    render: (_, record) => (
      <div>
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </div>
    ),
  },
];

export default accountColumns;
