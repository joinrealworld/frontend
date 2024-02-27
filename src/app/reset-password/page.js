"use client";

import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { MoveLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import './styles.css';
import ValidatedForm from "../../components/ValidatedForm";
import connect from '@/components/ConnectStore/connect';
import { apiURL } from '@/constant/global';
import { toast } from 'react-toastify';

function ResetPassword(props) {

  const { get } = useSearchParams();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState('');

  const onResetPasswordClick = async () => {
    try {
      // zzz
      const response = await fetch(apiURL + 'api/v1/user/set_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "password": password,
          "token": params, // zzz
        })
      });
      if (response.status >= 200 && response.status < 300) {
        const rsp = await response.json();
        if (rsp.payload) {
          router.replace('/login');
          toast("Password reset successfully!");
        } else {
          if (rsp.message && typeof rsp.message === 'string') {
            toast(rsp.message);
          } else {
            toast("Something went wrong!");
          }
        }
      } else {
        toast("Something went wrong!");
      }
    } catch (error) {
      toast("Something went wrong!");
    }
  };

  useEffect(() => {
    // zzz
    console.log("params --------------------------------");
    console.log(props);
    if (!get('token')) {
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

              <button className="main-button-o3n2dc" type="submit">Reset Password</button>

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