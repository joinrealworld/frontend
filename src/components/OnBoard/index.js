"use client";

import Image from 'next/image';
import Link from 'next/link';

import './styles.css';

export default function OnBoard(props) {
    return (
        <div className="main-body-vm34v absolute inset-0 items-center">
            <div className='content_r3rmgd'>
                <div className='text-center'>
                    <Image
                        src="/assets/logo-512-84985a75.png"
                        alt="Logo"
                        className='logo-cka34v'
                        width={256}
                        height={256}
                        priority
                    />
                    <h3 className="mt-3 text-center font-bold text-white">JOIN THE WORLD</h3>
                </div>
                <div style={{ width: '100%' }}>
                    <Link href="/register">
                        <button className="side-button-v92mc2">I don&apos;t have an account</button>
                    </Link>
                    <Link href="/login">
                        <button className="main-button-32mci3" type="submit">Log In</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}