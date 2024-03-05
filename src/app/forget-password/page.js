"use client";

import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { MoveLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button, Spinner } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

import './styles.css';
import ValidatedForm from "@/components/ValidatedForm";
import connect from '@/components/ConnectStore/connect';
import { apiURL, handleAPIError } from '@/constant/global';

function ForgetPassword(props) {

  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onResetPasswordClick = async () => {
    try {

      setIsLoading(true);
      const response = await fetch(apiURL + 'api/v1/user/forgot_password?email=' + emailAddress, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response);
      if (response.status >= 200 && response.status < 300) {
        const rsp = await response.json();
        if (rsp.payload) {
          router.replace('/login');
          toast("Forgot Password Email sent your email address.");
        } else {
          handleAPIError(rsp);
        }
        setIsLoading(false);
      } else {
        const rsp = await response.json();
        handleAPIError(rsp);
        setIsLoading(false);
      }
    } catch (error) {
      toast("Something went wrong!");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (props.user.isLoggedIn) {
      router.push('/');
    }
  }, []);

  return (
    <div className="main-body-pa23cs absolute inset-0 flex row justify-content-lg-center justify-content-md-center">
      <div className="fp-page-cam21as">
        <div className="form-cam24uu">
          <ValidatedForm
            rules={{
              emailAddress: {
                required: true,
                email: true,
              }
            }}
            messages={{
              emailAddress: {
                required: "Email address is required!",
                email: "Invalid Email address",
              },
            }}
            onSubmit={onResetPasswordClick}
          >
            <form >
              <h3 className='form-title-2kncasz'>Reset your password</h3>
              <div>
                <input
                  type="text"
                  name="emailAddress"
                  className="form-control-ba83as8"
                  placeholder="Email Address"
                  value={emailAddress}
                  id="email"
                  autoComplete="off"
                  onChange={(event) =>
                    setEmailAddress(event.target.value)
                  }
                />
              </div>

              <Button className="main-button-o3n2dc" isLoading={isLoading} fullWidth radius='sm' size='lg' type='submit' color='' spinner={<Spinner color='current' size='sm' />}>
                Send Reset Password Email
              </Button>

              <div className='back-action-k823nc'>
                <MoveLeft color="#b78727" size={23} style={{ marginTop: -16 }} />
                <Link href="/login">
                  <p className="back-msji783">Back To Login</p>
                </Link>
              </div>
            </form>
          </ValidatedForm>
        </div>
      </div>
    </div>
  );
}

export default connect(ForgetPassword);