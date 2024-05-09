import { ArrowUpRight } from 'lucide-react';
import LocalizedClientLink from '../localized-client-link';
import { Text } from '@/components/Typography';

type InteractiveLinkProps = {
  href: string;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  isIconHidden?: boolean;
};

const InteractiveLink = ({
  href,
  children,
  onClick,
  className,
  isIconHidden,
  ...props
}: InteractiveLinkProps) => {
  return (
    <LocalizedClientLink
      className={className}
      href={href}
      onClick={onClick}
      {...props}
    >
      <p>{children}</p>
      {!isIconHidden && <ArrowUpRight />}
    </LocalizedClientLink>
  );
};

export default InteractiveLink;
