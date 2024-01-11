import Link from 'next/link';
import { Container } from '../UI/containers';

const Navbar = () => {
  return (
    <nav className='py-4 border-b-2'>
      <Container className='flex justify-between items-center'>
        <div className='flex items-center '>
          <Link
            href='/'
            className='text-2xl font-bold text-gray-800 hover:text-gray-700 dark:text-white dark:hover:text-gray-300 lg:text-3xl'
          >
            RP
          </Link>
        </div>
        <div className='flex'>
          <Link
            href='/'
            className='px-4 py-2 text-sm font-medium hover:font-bold'
          >
            Home
          </Link>
          <Link
            href='/login'
            className='px-4 py-2 text-sm font-medium hover:font-bold'
          >
            Login
          </Link>
          <Link
            href='/signup'
            className='px-4 py-2 text-sm font-medium hover:font-bold'
          >
            Sign Up
          </Link>
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;
