import { Card } from '@/components/Card';
import { useUser } from '@/lib/providers/user-provider';
import dayjs from 'dayjs';
import { FC } from 'react';

type GeneralProps = {};

const General: FC<GeneralProps> = ({}) => {
	const { user } = useUser();

	return (
		<>
			<Card>
				<p>
					<strong>Ngày đặt hàng:</strong> {dayjs().format('DD/MM/YYYY')}
				</p>
				<p>
					<strong>Nhân viên mua hàng:</strong> {user?.first_name}{' '}
					{user?.last_name}
				</p>
			</Card>
		</>
	);
};

export default General;
