"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CircularProgress } from '@nextui-org/react';
import Image from 'next/image';

import './styles.css';
import connect from '@/components/ConnectStore/connect';
import { apiURL } from '@/constant/global';

function VerifyEmail(props) {

  const { get } = useSearchParams();

  const [result, setResult] = useState("Wait for confirming...");
  const [isFetch, setIsFetch] = useState(false);

  useEffect(() => {
    if (!get('o') || !get('e')) {
      setResult("Invalid URL Request!");
    } else {
      onVerifyEmail();
    }
  }, []);

  const onVerifyEmail = async () => {
    try {
      const response = await fetch(apiURL + 'api/v1/user/verify_otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "otp": get('o'), // zzz
          "email": get('e'), // zzz
        })
      });
      console.log("response--------------------------------");
      console.log(response);
      if (response.status >= 200 && response.status < 300) {
        const rsp = await response.json();
        if (rsp.payload) {
          // zzz
          setResult("Thank you! For confirming your email address.");
          setIsFetch(true);


        } else {
          if (rsp.message && typeof rsp.message === 'string') {
            setResult("Invalid URL Request!");
            setIsFetch(true);
          } else {
            setResult("Invalid URL Request!");
            setIsFetch(true);
          }
        }
      } else {
        setResult("Invalid URL Request!");
        setIsFetch(true);
      }
    } catch (error) {
      setResult("Invalid URL Request!");
      setIsFetch(true);
    }
  };

  return (
    <div className="main-body-pa23csda absolute inset-0 flex row justify-content-lg-center justify-content-md-center">
      <div className="fp-page-cam21as">
        <Image
          src="/assets/logo-512-84985a75.png"
          alt="Logo"
          className='logo-cka34v'
          width={140}
          height={140}
          priority
        />
        <div style={{ marginTop: 44, alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
          {!isFetch &&
            <CircularProgress size='lg' color="warning" aria-label="Loading..." />
          }
          <h3 className='form-title-2kncasz'>{result}</h3>
        </div>
      </div>
    </div >
  );
}

export default connect(VerifyEmail);