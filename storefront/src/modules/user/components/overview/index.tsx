import OverviewDesktop from './OverviewDesktop';
import OverviewMobile from './OverviewMobile';

type OverviewProps = {};

const Overview = ({}: OverviewProps) => {
	return (
		<>
			<div className="hidden lg:block">
				<OverviewDesktop />
			</div>
			<div className="block lg:hidden">
				<OverviewMobile />
			</div>
		</>
	);
};

export default Overview;
