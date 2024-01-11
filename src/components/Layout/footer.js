import Link from 'next/link';
import { Container } from '../UI/containers';

const Footer = () => {
  return (
    <footer className='py-2 border-t-2'>
      <Container className='flex justify-center items-center text-sm font-medium'>
        © {new Date().getFullYear()}&nbsp;
        <Link href={'/'} target='_blank' rel='noopener noreferrer'>

          Harsh Patel

        </Link>
        . All Rights Reserved.
      </Container>
    </footer>
  );
};

export default Footer;
