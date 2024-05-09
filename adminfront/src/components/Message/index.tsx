'use client';
import { FC } from 'react';

import { message } from 'antd';

let messageApi: any;

export const MessageProvider = ({ children }) => {
	const [AntdMessageApi, contextHolder] = message.useMessage();
	return (
		<>
			{contextHolder}
			{children}
		</>
	)
	messageApi = AntdMessageApi;
};

export const useMessage = () => {
	return messageApi;
}