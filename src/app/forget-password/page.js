"use client";

import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { MoveLeft } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';

import './styles.css';
import ValidatedForm from "../../components/ValidatedForm";
import connect from '@/components/ConnectStore/connect';

function ForgetPassword(props) {

  const dispatch = useDispatch();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');

  const onResetPasswordClick = () => {

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

              <button className="main-button-o3n2dc" type="submit">Send Reset Password Email</button>

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