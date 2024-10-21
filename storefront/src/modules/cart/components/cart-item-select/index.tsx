import React from 'react';
import { Button } from '@/components/Button';
import { InputNumber } from '@/components/Input';
import { Minus, Plus } from 'lucide-react';
import { message } from 'antd';

type CartItemSelectProps = {
	quantity: number;
	onChange: (quantity: number) => void;
	allowed_quantities: number;
};

const CartItemSelect: React.FC<CartItemSelectProps> = ({
	quantity,
	onChange,
	allowed_quantities,
}) => {
	const handleAddNumber = () => {
		onChange(quantity + allowed_quantities);
	};

	const handleSubtractNumber = () => {
		if (quantity > allowed_quantities) {
			onChange(quantity - allowed_quantities);
		}
	};

	const handleInputChange = (value: number | null) => {
		if (value !== null) {
			if (value > 0) {
				if (value % allowed_quantities === 0) {
					onChange(value);
				} else {
					message.warning(`Số lượng phải là bội số của ${allowed_quantities}.`);
					const roundedValue =
						Math.round(value / allowed_quantities) * allowed_quantities;
					onChange(roundedValue);
				}
			} else {
				// If input becomes 0 or negative, set it to allowed_quantities
				message.warning(`Số lượng tối thiểu là ${allowed_quantities}.`);
				onChange(allowed_quantities);
			}
		}
	};

	return (
		<div className="flex items-center gap-2">
			<InputNumber
				addonBefore={
					<Button
						onClick={handleSubtractNumber}
						icon={<Minus size={12} />}
						type="text"
						className="hover:bg-transparent w-[12px]"
						size="small"
					/>
				}
				addonAfter={
					<Button
						onClick={handleAddNumber}
						icon={<Plus size={12} />}
						type="text"
						className="hover:bg-transparent w-[12px]"
						size="small"
					/>
				}
				controls={false}
				value={quantity}
				className="max-w-[120px] [&_input]:text-center "
				onChange={handleInputChange as any}
				size="small"
        min={allowed_quantities}
        step={allowed_quantities}
			/>
		</div>
	);
};

export default CartItemSelect;
