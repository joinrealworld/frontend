"use client";

import { useState } from 'react'
import Link from 'next/link';
import { MoveLeft } from 'lucide-react';
import { useDispatch } from 'react-redux';

import './styles.css';
import { connect } from '@/components/ConnectStore/connect';
import ValidatedForm from "../../components/ValidatedForm";


function ForgetPassword(props) {

  const dispatch = useDispatch();

  const [emailAddress, setEmailAddress] = useState('');

  const onLoginClick = () => {

  };

  if (props.user.isLoggedIn) {
    router.push('/');
    return null;
  }

  return (
    <div className="main-body absolute inset-0 flex row justify-content-lg-center justify-content-md-center">
      <div className="login-page">
        <div className="form">
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
            onSubmit={() => onLoginClick()}
          >
            <form >
              <h3>Reset your password</h3>
              <div>
                <input
                  type="text"
                  name="emailAddress"
                  className="form-control"
                  placeholder="Email Address"
                  value={emailAddress}
                  id="email"
                  autoComplete="off"
                  onChange={(event) =>
                    setEmailAddress(event.target.value)
                  }
                />
              </div>

              <div className="d-grid">
                <button className="btn btn-primary" type="submit">Send Reset Password Email</button>
              </div>

              <div className='back-action'>
                <MoveLeft color="#b78727" size={23} style={{ marginBottom: 3.5 }} />
                <Link href="/login">
                  <p className="back">Back To Login</p>
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
