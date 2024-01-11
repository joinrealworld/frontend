"use client";

import Link from 'next/link';

import './styles.css';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';

export default function HomePage(props) {

    const dispatch = useDispatch();
    const router = useRouter();

    const onLogoutClick = (e) => {
        e.preventDefault();
        dispatch(props.actions.userLogout());
        router.replace('/');
    }

    return (
        <div className="main-body absolute inset-0 flex flex-col items-center">
            <div className='flex flex-col items-center'>
                <h1 className="mt-[20%] text-center text-[60px] font-bold text-white">Welcome</h1>
                <h2 className="mt-[20px] text-center text-[25px] font-bold text-white">Login Successfully!</h2>
            </div>
            <div className="mt-5 w-full max-w-[400px] p-8">
                <Link href="#" onClick={onLogoutClick}>
                    <div className="d-grid">
                        <button className="btn btn-primary main-button" type="submit">Logout</button>
                    </div>
                </Link>
            </div>
        </div>
    );
}