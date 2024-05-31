import { Customer } from '@medusajs/medusa';
import OverviewMobile from './OverviewMobile';

type OverviewProps = {
  customer: Omit<Customer, 'password_hash'> | null;
};

const Overview = ({ customer }: OverviewProps) => {
  return (
    <>
      <div className='hidden lg:block'>Desktop</div>
      <div className='block lg:hidden'>
        <OverviewMobile customer={customer} />
      </div>
    </>
  );
};

export default Overview;
