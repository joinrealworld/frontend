"use client";

import './styles.css';

import { connect } from 'react-redux';
import Image from 'next/image';
import Link from 'next/link';

function HomePage(props) {
  return (
    <div className="main-body absolute inset-0 flex flex-col items-center">
      <div className='flex flex-col items-center'>
        <Image
          src="/assets/logo-512-84985a75.png"
          alt="Logo"
          className='logo'
          width={256}
          height={256}
          priority
        />
        <h2 className="mt-[20%] text-center text-[30px] font-bold text-white">JOIN THE WORLD</h2>
      </div>
      <div className="mt-5 w-full max-w-[400px] p-8">
        <Link href="/register">
          <button className="btn btn-primary side-button">I don't have an account</button>
        </Link>
        <Link href="/login">
          <div className="d-grid">
            <button className="btn btn-primary main-button" type="submit">Log In</button>
          </div>
        </Link>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    ...state
  }
}

export default connect(mapStateToProps)(HomePage);