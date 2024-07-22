import { useState } from 'react';
import { message } from 'antd';
import { clsx } from 'clsx';
import { Plus, Minus } from 'lucide-react';

export const EditableRow = ({ index, ...props }) => {
  // const [form] = Form.useForm();
  return (
    // <Form form={form} component={false}>
    //   <EditableContext.Provider value={form}>
        <tr {...props} />
    //   </EditableContext.Provider>
    // </Form>
  );
};

interface EditableCellProps {
	title: ReactNode;
	editable: boolean;
	children: ReactNode;
	dataIndex: keyof Item;
	record: Item;
	// handleSave: (record: Item) => void;
	handleQuantity: (change: number, item: Omit<LineItem, 'beforeInsert'>) => void;
};

export const EditableCell = ({
	title,
	editable,
	children,
	dataIndex,
	record,
	// handleSave,
	handleQuantity,
	...restProps
}: EditableCellProps) => {

	let childNode = children;

	if (editable) {
    childNode = (
      <div className="text-gray-500 flex w-full justify-start text-right">
        <span
          onClick={() => handleQuantity(-1, record)}
          className="hover:bg-gray-200 mr-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded-md"
        >
          <Minus size={16} />
        </span>
        <span>{record[dataIndex] || ""}</span>
        <span
          onClick={() => handleQuantity(1, record)}
          className={clsx("hover:bg-gray-200 ml-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded-md")}
        >
          <Plus size={16} />
        </span>
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};