import React from 'react';
import { Button } from '@/components/Button';
import { InputNumber } from '@/components/Input';
import { Minus, Plus } from 'lucide-react';

type CartItemSelectProps = {
  quantity: number;
  onChange: (quantity: number) => void;
};

const CartItemSelect: React.FC<CartItemSelectProps> = ({
  quantity,
  onChange,
}) => {
  const handleAddNumber = () => {
    onChange(quantity + 1);
  };

  const handleSubtractNumber = () => {
    if (quantity > 1) {
      onChange(quantity - 1);
    }
  };

  const handleInputChange = (value: number | null) => {
    if (value !== null && value > 0) {
      onChange(value);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* <span>Số lượng: </span> */}
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
      />
    </div>
  );
};

export default CartItemSelect;
