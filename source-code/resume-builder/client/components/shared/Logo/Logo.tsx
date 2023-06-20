import { Link } from '@mui/material';

interface ILogoProps {}

const Logo = ({}: ILogoProps) => {
  return (
    <Link className="pr-[40px]">
      <img src="/images/logos/midcv-logo.png" className="mt-[10px] h-[38px] w-[92px]" />
    </Link>
  );
};

export default Logo;
