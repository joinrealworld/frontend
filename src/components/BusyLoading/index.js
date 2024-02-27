"use client";

import { Spinner } from '@nextui-org/react';

import './styles.css';

export default function BusyLoading(props) {

    if (!props.isLoading) return;
    return (
        <div className='spinner-wrapper-3mdaw' style={{ position: 'fixed' }}>
            <div className='spinner-content-3mdaw'>
                <Spinner color="warning" />
                <span className='loading-text-aed3c'>Loading...</span>
            </div>
        </div>
    );
}