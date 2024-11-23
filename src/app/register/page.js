"use client";

import { useEffect, useState } from 'react'
import Link from 'next/link';
import { MoveLeft, CheckCircle2, Check } from 'lucide-react';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Button, Spinner } from '@nextui-org/react';

import './styles.css';
import ValidatedForm from "@/components/ValidatedForm";
import { lightTheme } from '@/themes/lightTheme';
import { darkTheme } from '@/themes/darkTheme';
import connect from '@/components/ConnectStore/connect';
import { appName, apiURL, handleAPIError } from "@/constant/global";

const Steps = {
  personalInfo: 1,
  selectPlan: 2,
  cardInfo: 3,
}

function Register(props) {

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (props.user.isLoggedIn) {
      router.push('/');
    } else {
      getSubscriptionList();
    }
  }, []);

  const [emailAddress, setEmailAddress] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCVV] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedStep, setSelectedStep] = useState(Steps.personalInfo);
  const [isLoading, setIsLoading] = useState(false);

  const [isAnnual, setIsAnnual] = useState(false);

  const handleBillingToggle = (event) => {
    setIsAnnual(event.target.checked);
    console.log(event.target.checked ? "Annually selected" : "Monthly selected");
  };


  const onPersonalInfoNext = async () => {
    checkEmailExistOrNot();
  };

  const onPlanSelectionNext = async () => {
    setSelectedStep(Math.min((selectedStep + 1), Object.keys(Steps).length));
  };

  const onCardInfoNext = async () => {
    setSelectedStep(Math.min((selectedStep + 1), Object.keys(Steps).length));
    onRegister();
  };

  const getSubscriptionList = async () => {
    try {
      const response = await fetch(apiURL + 'api/v1/payment/fetch_prices', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const rsp = await response.json();
      if (response.status >= 200 && response.status < 300) {
        if (rsp.payload && rsp.payload.data) {
          let prices = rsp.payload.data;
          prices.sort((a, b) => a.unit_amount - b.unit_amount);
          setPlans(prices);
          setSelectedPlan(prices[0]);
        } else {
          handleAPIError(rsp);
        }
      } else {
        handleAPIError(rsp);
      }
    } catch (error) {
      toast("Something went wrong!");
    }
  }

  const checkEmailExistOrNot = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(apiURL + 'api/v1/user/check/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "email": emailAddress
        })
      });
      const rsp = await response.json();
      if (rsp?.status > 0) {
        setSelectedStep(Math.min((selectedStep + 1), Object.keys(Steps).length));
      } else {
        handleAPIError(rsp);
      }
      setIsLoading(false);
    } catch (error) {
      toast("Something went wrong!");
      setIsLoading(false);
    }
  }

  const onRegister = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(apiURL + 'api/v1/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "first_name": firstName,
          "last_name": lastName,
          "email": emailAddress,
          "password": password,
          "card_number": Number(cardNumber),
          "card_exp_month": Number(expiryDate.split('/')[0]),
          "card_exp_year": Number(expiryDate.split('/')[1]),
          "card_cvc": Number(cvv),
          "card_name": cardHolder,
          "price_id": selectedPlan?.id
        })
      });
      const rsp = await response.json();
      if (response.status >= 200 && response.status < 300) {
        if (rsp.payload?.data?.user && rsp.payload?.data?.user?.id) {
          if (rsp.payload?.data?.user?.theme == 'dark') {
            darkTheme();
            localStorage.setItem("theme", JSON.stringify('dark'));
          }
          else if (rsp.payload?.data?.user?.theme == 'light') {
            lightTheme();
            localStorage.setItem("theme", JSON.stringify('light'));
          }
          dispatch(props.actions.userLogin({
            user: rsp.payload?.data?.user,
            authToken: rsp.payload?.data?.token?.access,
            refreshToken: rsp.payload?.data?.token?.refresh
          }));
          router.replace('/');
        } else {
          handleAPIError(rsp);
          setIsLoading(false);
        }
      } else {
        handleAPIError(rsp);
        setIsLoading(false);
      }
    } catch (error) {
      toast("Something went wrong!");
      setIsLoading(false);
    }
  }

  const renderPersonalInfo = () => {
    return (
      <div className={"form-139nc3"}>
        <ValidatedForm
          rules={{
            emailAddress: {
              required: true,
              email: true,
            },
            firstName: {
              required: true,
            },
            lastName: {
              required: true,
            },
            password: {
              required: true,
              minLength: 8,
            },
            confirmPassword: {
              required: true,
              matches: password
            },
          }}
          messages={{
            emailAddress: {
              required: "Email address is required!",
              email: "Invalid Email address",
            },
            firstName: {
              required: "First name is required!"
            },
            lastName: {
              required: "Last name is required!"
            },
            password: {
              required: "Password is required!",
              minLength: "Minimum 8 digit is required!",
            },
            confirmPassword: {
              required: "Confirm Password is required!",
              matches: "Confirm Password is not matched!",
            },
          }}
          onSubmit={onPersonalInfoNext}
        >
          <form >
            <Link href="/login" className="back-2fk29a">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg> Go to Login
            </Link>
            <h3 className='form-title-130mcad'>Personal Information</h3>
            <div>
              <input
                type="text"
                name="emailAddress"
                className="form-control-3mac82n"
                placeholder="Email Address"
                value={emailAddress}
                autoComplete="off"
                onChange={(event) =>
                  setEmailAddress(event.target.value)
                }
              />
            </div>
            <div>
              <input
                type="text"
                name="firstName"
                className="form-control-3mac82n"
                placeholder="First Name"
                autoComplete="off"
                value={firstName}
                onChange={(event) =>
                  setFirstName(event.target.value)
                }
              />
            </div>
            <div>
              <input
                type="text"
                name="lastName"
                className="form-control-3mac82n"
                placeholder="Last Name"
                autoComplete="off"
                value={lastName}
                onChange={(event) =>
                  setLastName(event.target.value)
                }
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                className="form-control-3mac82n"
                placeholder="Password"
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
                className="form-control-3mac82n"
                placeholder="Confirm Password"
                autoComplete="off"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
              />
            </div>

            <Button className="main-button-mac31cas" isLoading={isLoading} fullWidth radius='sm' size='lg' type='submit' color='' spinner={<Spinner color='current' size='sm' />}>
              NEXT
            </Button>

          </form>
        </ValidatedForm>
      </div>
    );
  }

  const getCurrencySymbol = (currencyCode, locale = 'en-US') => {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    // Extract the currency symbol
    const symbol = formatter.formatToParts(0).find(part => part.type === 'currency').value;

    return symbol;
  }

  const renderPlans = () => {
    return (
      <div className={"form-139nc3"}>
        <form onSubmit={onPlanSelectionNext}>
          <div className="back-2fk29a" onClick={() => setSelectedStep(Math.max((selectedStep - 1), 1))}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg> Back
          </div>
          <h3 className='form-title-130mcad'>Choose a Plan</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="billing-toggle">
              <label className="billing-switch">
                <input type="checkbox" onChange={handleBillingToggle} />
                <span className="slider">
                  <span className="billing-option monthly">Monthly</span>
                  <span className="billing-option annually">Annually</span>
                </span>
              </label>
            </div>
            <div className={`save-percentage ${isAnnual ? 'save-percentage' : 'save-percentage-gray'}`}>Save 16.67%</div>
          </div>

          <div className="pricing-card-da2fma" style={{ flexDirection: 'row', alignItems: 'center', display: 'flex' }}>
            {/* <div className="card-header-ea21caw">
              <div className="card-btn-parent-1mqidn">
                {plans.map((item, index) => {
                  return (
                    <button
                      key={index}
                      className={selectedPlan?.id == item.id ? "active" : undefined}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedPlan(item)
                      }}
                    >
                      {item.nickname}
                    </button>
                  );
                })}
                <div className="overlay"></div>
              </div>
            </div> */}
            <div className="card-body-mzc29q">
              <div className='active'>
                <div className="card-plans-cnq27as">
                  <span className="plan-tag-23an1cz">Regular</span>
                  <div className="card-sub-plan-mcai2bc">
                    <h3 className="plan-title-nc17ab">{isAnnual ? <span ><s className='strike-plans'>$360</s> $300</span> : '$30'}</h3>
                    <h6 className="plan-duration-mc81bd">{isAnnual ? <span > /per year</span> : <span > /per month</span>} </h6>
                  </div>
                </div>
                <button className="main-button-mac31cas-plans" type="submit"  >
                  Select
                </button>
                <div className="card-content-va32da">
                  <div className="card-lists-cn127s">
                    <span className="plan-tag-23an1cz">Key features</span>
                    <ul class="inline-list">
                      <li ><Check size={18} style={{ marginRight: "10", marginTop: 2 }} />Web libraries</li>
                      <li ><Check size={18} style={{ marginRight: "10", marginTop: 2 }} />API reference</li>
                      <li ><Check size={18} style={{ marginRight: "10", marginTop: 2 }} />Test environments</li>
                      <li ><Check size={18} style={{ marginRight: "10", marginTop: 2 }} />Responsive designs</li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>
            <div className="card-body-mzc29q">
              <h3 className='recommeded-plan'>Recommended</h3>
              <div className='active'>
                <div className="card-plans-cnq27as">
                  <span className="plan-tag-23an1cz">VIP</span>
                  <div className="card-sub-plan-mcai2bc">
                    <h3 className="plan-title-nc17ab">{isAnnual ? <span ><s className='strike-plans'>$720</s> $600</span> : '$60'}</h3>
                    <h6 className="plan-duration-mc81bd">{isAnnual ? <span > /per year</span> : <span > /per month</span>} </h6>
                  </div>
                </div>
                <button className="main-button-mac31cas-plans" type="submit"  >
                  Select
                </button>
                <div className="card-content-va32da">
                  <div className="card-lists-cn127s">
                    <span className="plan-tag-23an1cz">Key features</span>
                    <ul class="inline-list">
                      <li ><Check size={18} style={{ marginRight: "10", marginTop: 2 }} />Developer friendly</li>
                      <li ><Check size={18} style={{ marginRight: "10", marginTop: 2 }} />Web libraries</li>
                      <li ><Check size={18} style={{ marginRight: "10", marginTop: 2 }} />API reference</li>
                      <li ><Check size={18} style={{ marginRight: "10", marginTop: 2 }} />Test environments</li>
                      <li ><Check size={18} style={{ marginRight: "10", marginTop: 2 }} />Plug &amp; Play</li>
                      <li ><Check size={18} style={{ marginRight: "10", marginTop: 2 }} />Responsive designs</li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>

            {/* <div className="card-body-mzc29q">
              {plans.map((item, index) => {
                return (
                  <div key={index} id={item.id} className={selectedPlan?.id == item.id ? "active" : undefined}>
                    <p className="plan-select-details">You've selected the {item.nickname} plan. You can still choose from the other two options.</p>
                    <div className="card-plans-cnq27as">
                      <span className="plan-tag-23an1cz">{item.nickname}</span>
                      <div className="card-sub-plan-mcai2bc">
                        <h3 className="plan-title-nc17ab">{getCurrencySymbol((item.currency + "").toUpperCase())}{item.unit_amount / 100}</h3>
                        <h6 className="plan-duration-mc81bd"> / {item?.recurring?.interval_count} {item?.recurring?.interval}</h6>
                      </div>
                    </div>
                    <div className="card-content-va32da">
                      <p>{item.description}</p>
                      <div className="card-lists-cn127s">
                        {item.benefits.map((item, index) => {
                          return (
                            <div key={index} className="card-list-3emao8n">
                              <CheckCircle2 className='check-mark-a3pzcm' color="#50C878" size={16} />
                              <div className='benefits-ma8b2'>
                                {item.text}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    <button className="main-button-mac31cas-plans"  type="submit"  >
                      Get {item.nickname}
                    </button>
                     <div className="card-content-va32da">
                      <div className="card-lists-cn127s">
                      <span className="plan-tag-23an1cz">Key features</span>
                      <ul class="inline-list">
                        <li ><Check size={18} style={{marginRight:"10",marginTop:2}}/>Developer friendly documents</li>
                        <li ><Check size={18} style={{marginRight:"10",marginTop:2}}/>Web libraries</li>
                        <li ><Check size={18} style={{marginRight:"10",marginTop:2}}/>API reference</li>
                        <li ><Check size={18} style={{marginRight:"10",marginTop:2}}/>Test environments</li>
                        <li ><Check size={18} style={{marginRight:"10",marginTop:2}}/>Plug &amp; Play</li>
                        <li ><Check size={18} style={{marginRight:"10",marginTop:2}}/>Responsive designs</li>
                      </ul>
                      </div>
                    </div> 
                     
                  </div>     
                )
              })}
            </div> */}
          </div>


        </form>
      </div>
    );
  }


  const renderCardInfo = () => {
    return (
      <div className={"form-139nc3"}>
        <ValidatedForm
          rules={{
            cardNumber: {
              required: true,
              creditCard: true
            },
            expiryDate: {
              required: true,
              expiryDate: true
            },
            cvv: {
              required: true,
              cvv: true
            },
            cardHolder: {
              required: true,
            },
          }}
          messages={{
            cardNumber: {
              required: "Card Number is required!",
              creditCard: "Invalid Card Number"
            },
            expiryDate: {
              required: "Expiration date is required!",
              expiryDate: "Invalid Expiration date"
            },
            cvv: {
              required: "CVV is required!",
              cvv: "Invalid CVV"
            },
            cardHolder: {
              required: "Card Holder Name is required!"
            },
          }}
          onSubmit={onCardInfoNext}
        >
          <form >
            <div className="back-2fk29a" onClick={() => setSelectedStep(Math.max((selectedStep - 1), 1))}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg> Back
            </div>
            <h3 className='form-title-130mcad'>Enter Credit Card</h3>
            <div>
              <input
                type="text"
                name="cardHolder"
                className="form-control-3mac82n"
                placeholder="Card Holder Name"
                autoComplete="off"
                value={cardHolder}
                onChange={(event) =>
                  setCardHolder(event.target.value)
                }
              />
            </div>
            <div>
              <input
                type="text"
                name="cardNumber"
                maxLength={16}
                className="form-control-3mac82n"
                placeholder="Card Number"
                value={cardNumber}
                autoComplete="off"
                onChange={(event) =>
                  setCardNumber(event.target.value)
                }
              />
            </div>
            <div>
              <input
                type="tel"
                name="expiryDate"
                maxLength={7}
                className="form-control-3mac82n"
                placeholder="Expiration Date (MM/YYYY)"
                autoComplete="off"
                value={expiryDate}
                onChange={(event) =>
                  setExpiryDate(event.target.value)
                }
              />
            </div>
            <div>
              <input
                type="tel"
                name="cvv"
                maxLength={3}
                className="form-control-3mac82n"
                placeholder="cvv"
                autoComplete="off"
                value={cvv}
                onChange={(event) =>
                  setCVV(event.target.value)
                }
              />
            </div>

            <Button className="main-button-mac31cas" isLoading={isLoading} fullWidth radius='sm' size='lg' type='submit' color='' spinner={<Spinner color='current' size='sm' />}>
              SUBMIT
            </Button>

          </form>
        </ValidatedForm>
      </div>
    );
  }

  const renderContent = () => {
    if (selectedStep == Steps.personalInfo) {
      return renderPersonalInfo();
    } else if (selectedStep == Steps.selectPlan) {
      return renderPlans();
    } else if (selectedStep == Steps.cardInfo) {
      return renderCardInfo();
    }
  }

  return (
    <div className="main-body-8cnajw absolute inset-0 flex row justify-content-lg-center justify-content-md-center">
      <div className="content-km38nca">
        <div className="left-side-023mca">
          <div className="left-content-83rnzx flex flex-col text-primary-content items-center">
            <div className='logo-image-nac93c'>
              <Image
                src="/assets/logo-512-84985a75.png"
                alt="Logo"
                className='logo-8485a75'
                width={226}
                height={226}
                priority
              />
            </div>
            <div>
              <p className="title-m3ic4n lg:text-[28px] font-black text-[25px] mx-auto">
                {appName}
              </p>
              <h5 className="sub-title-m3ic4n lg:text-[22px] text-[21px] mx-auto mt-2">
                ESCAPE THE MATRIX
              </h5>
            </div>
          </div>
        </div>
        <div className='right-side-cbs782c'>
          {renderContent()}
        </div>
      </div>

    </div>
  );
}

export default connect(Register);
