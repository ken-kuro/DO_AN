import Image from 'next/image';
import { useRouter } from 'next/router';

type Props = {
  size?: 256 | 64 | 48 | 40 | 32;
};

const Logo: React.FC<Props> = ({ size = 64 }) => {
  const router = useRouter();

  return (
    <Image
      onClick={() => router.push('/')}
      alt="Reactive Resume"
      src="/images/logos/midcv-logo.png"
      className="rounded"
      width={size}
      height={size}
      priority
      style={{
        cursor: 'pointer',
      }}
    />
  );
};

export default Logo;
