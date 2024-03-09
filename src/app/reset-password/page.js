"use client";

import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { MoveLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { Button, Spinner } from '@nextui-org/react';

import './styles.css';
import ValidatedForm from "@/components/ValidatedForm";
import connect from '@/components/ConnectStore/connect';
import { apiURL, handleAPIError } from '@/constant/global';

function ResetPassword(props) {

  const { get } = useSearchParams();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onResetPasswordClick = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(apiURL + 'api/v1/user/set_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "password": password,
          "token": get('t'),
        })
      });
      const rsp = await response.json();
      if (response.status >= 200 && response.status < 300) {
        if (rsp.payload) {
          router.replace('/login');
          toast("Password reset successfully!");
        } else {
          handleAPIError(rsp);
        }
        setIsLoading(false);
      } else {
        handleAPIError(rsp);
        setIsLoading(false);
      }
    } catch (error) {
      toast("Something went wrong!");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // zzz
    if (!get('t')) {
      toast("Invalid request!");
      router.push('/');
    }
  }, []);

  return (
    <div className="main-body-pa23cs absolute inset-0 flex row justify-content-lg-center justify-content-md-center">
      <div className="fp-page-cam21as">
        <div className="form-cam24uu">
          <ValidatedForm
            rules={{
              password: {
                required: true,
              },
              confirmPassword: {
                required: true,
                matches: password
              },
            }}
            messages={{
              password: {
                required: true,
              },
              confirmPassword: {
                required: "Confirm Password is required!",
                matches: "Confirm Password is not matched!",
              },
            }}
            onSubmit={onResetPasswordClick}
          >
            <form >
              <h3 className='form-title-2kncasz'>Set new password</h3>

              <div>
                <input
                  type="password"
                  name="password"
                  className="form-control-45a2bz"
                  placeholder="New Password"
                  autoComplete="off"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                />
              </div>

              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control-45a2bz"
                  placeholder="Confirm Password"
                  autoComplete="off"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                />
              </div>

              <Button className="main-button-o3n2dc" isLoading={isLoading} fullWidth radius='sm' size='lg' type='submit' color='' spinner={<Spinner color='current' size='sm' />}>
                Reset Password
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

export default connect(ResetPassword);