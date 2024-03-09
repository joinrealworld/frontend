"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, CircularProgress } from '@nextui-org/react';
import Image from 'next/image';

import './styles.css';
import connect from '@/components/ConnectStore/connect';
import { apiURL, handleAPIError } from '@/constant/global';

function VerifyEmail(props) {

  const router = useRouter();
  const { get } = useSearchParams();

  const [result, setResult] = useState("Wait for confirming...");
  const [isFetch, setIsFetch] = useState(false);

  useEffect(() => {
    if (!get('e')) {
      setIsFetch(false);
      setResult("Invalid URL Request!");
    } else {
      onVerifyEmail();
    }
  }, []);

  const onVerifyEmail = async () => {
    try {
      const response = await fetch(apiURL + 'api/v1/user/verify_email?t=' + get('e'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("response--------------------------------");
      console.log(response);
      const rsp = await response.json();
      if (response.status >= 200 && response.status < 300) {
        if (rsp.payload) {
          setResult("Thank you! For confirming your email address.");
        } else {
          handleAPIError(rsp);
        }
        setIsFetch(true);
      } else {
        handleAPIError(rsp);
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

        <div>
          <Button className="main-button-72bahv2" radius='sm' size='lg' type='submit' color='' onClick={(e) => router.replace('/login')}>
            Log In
          </Button>
        </div>
      </div>
    </div >
  );
}

export default connect(VerifyEmail);