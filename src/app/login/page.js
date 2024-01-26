"use client";

import { useEffect, useState } from 'react'
import Link from 'next/link';
import { MoveLeft } from 'lucide-react';
import { useDispatch } from 'react-redux';

import './styles.css';
import ValidatedForm from "../../components/ValidatedForm";
import connect from '@/components/ConnectStore/connect';
import { apiURL } from '@/constant/global';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

function Login(props) {

  const dispatch = useDispatch();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState("");

  const onLoginClick = async () => {
    try {
      const response = await fetch(apiURL + 'api/v1/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "email": emailAddress,
          "password": password
        })
      });
      if (response.status >= 200 && response.status < 300) {
        const rsp = await response.json();
        if (rsp.payload?.user && rsp.payload?.user?.id) {
          dispatch(props.actions.userLogin({
            user: rsp.payload?.user,
            authToken: rsp.payload?.token?.access,
            refreshToken: rsp.payload?.token?.refresh
          }));
          router.replace('/');
        } else {
          toast("Something went wrong!");
        }
      } else {
        toast("Something went wrong!");
      }
    } catch (error) {
      toast("Something went wrong!");
    }
  };

  useEffect(() => {
    if (props.user.isLoggedIn) {
      router.push('/');
    }
  }, []);


  return (
    <div className="main-body-lan229 absolute inset-0 flex row justify-content-lg-center justify-content-md-center">
      <div className="login-page-mcaiwd">
        <div className="form-mc72bk">
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
            onSubmit={onLoginClick}
          >
            <form>
              <h3 className='form-title-sm2fca'>Sign in to your account</h3>
              <div>
                <input
                  type="text"
                  name="emailAddress"
                  className="form-control-q3csd"
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
                  className="form-control-q3csd"
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
                <p className="fp-link-23mcma">Forgot your password?</p>
              </Link>

              <button className="main-button-mc2342" type="submit">Log In</button>

              <div className='back-action-ms32sa'>
                <MoveLeft color="#b78727" size={23} style={{ marginBottom: 3.5 }} />
                <Link href="/">
                  <span className="back-jak29a">Go Back</span>
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
