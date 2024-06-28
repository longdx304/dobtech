import CheckoutForm from './checkout-form';
import CheckoutSummary from './checkout-summary';

type Props = {};

const CheckoutTemplate = ({}: Props) => {
	return (
		<div className="box-border flex flex-col gap-8">
			<div className="grid grid-cols-1 lg:grid-cols-[1fr_416px] gap-x-8">
				<CheckoutForm />
				<CheckoutSummary />
			</div>
		</div>
	);
};

export default CheckoutTemplate;
