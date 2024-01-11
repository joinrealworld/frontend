"use client";

import { useState } from 'react'
import Link from 'next/link';
import { MoveLeft } from 'lucide-react';
import { useDispatch } from 'react-redux';

import './styles.css';
import ValidatedForm from "../../components/ValidatedForm";
import { connect } from '@/components/ConnectStore/connect';
import { apiURL } from '@/constant/global';
import { useRouter } from 'next/navigation';

function Login(props) {

  const dispatch = useDispatch();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');

  const onLoginClick = async () => {
    dispatch(props.actions.userLogin({ user: { "id": "1", "name": "Harsh" } }));
    router.replace('/');
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
              },
              password: {
                required: true,
              },
            }}
            messages={{
              emailAddress: {
                required: "Email address is required!",
                email: "Invalid Email address",
              },
              password: {
                required: "Password is required!",
                password: "Invalid Password"
              },
            }}
            onSubmit={() => onLoginClick()}
          >
            <form >
              <h3>Sign in to your account</h3>
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

              <div>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  autoComplete="off"
                  id="pass"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                />
              </div>

              <Link href="/forget-password">
                <p className="message">Forgot your password?</p>
              </Link>

              <div className="d-grid">
                <button className="btn btn-primary" type="submit">Log In</button>
              </div>

              <div className='back-action'>
                <MoveLeft color="#b78727" size={23} style={{ marginBottom: 3.5 }} />
                <Link href="/">
                  <p className="back">Go Back</p>
                </Link>
              </div>
            </form>
          </ValidatedForm>
        </div>
      </div>
    </div>
  );
}

export default connect(Login);
