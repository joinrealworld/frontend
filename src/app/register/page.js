"use client";

import { useEffect, useState } from 'react'
import Link from 'next/link';
import { MoveLeft, CheckCircle2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Button, Spinner } from '@nextui-org/react';

import './styles.css';
import ValidatedForm from "@/components/ValidatedForm";
import connect from '@/components/ConnectStore/connect';
import { appName, handleAPIError } from "@/constant/global";

const SubscriptionPlans = [
  {
    id: 'card-basic-plan',
    price: '$49.99',
    duration: '1 month',
    name: 'Cadet',
    description: 'A first step towards breaking free',
    benefits: [],
    savePercentage: 0,
  },
  {
    id: 'card-standard-plan',
    price: '$250',
    duration: '6 months',
    name: 'Contender',
    description: 'Six months to harness your power',
    benefits: [
      { text: 'Daily coin bonus' }
    ],
    savePercentage: 17,
  },
  {
    id: 'card-premium-plan',
    price: '$850',
    duration: '2 years',
    name: 'Champion',
    description: 'Two years of complete commitment',
    benefits: [
      { text: 'Maximum daily coin bonus' },
      { text: 'Exclusive features' },
      { text: 'Special emergency broadcasts' }
    ],
    savePercentage: 29,
  },
]

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
  const [billingAddress, setBillingAddress] = useState('');

  const [selectedPlan, setSelectedPlan] = useState(SubscriptionPlans[0]);
  const [selectedStep, setSelectedStep] = useState(Steps.personalInfo);
  const [isLoading, setIsLoading] = useState(false);

  const onPersonalInfoNext = async () => {
    setSelectedStep(Math.min((selectedStep + 1), Object.keys(Steps).length));
  };

  const onPlanSelectionNext = async () => {
    setSelectedStep(Math.min((selectedStep + 1), Object.keys(Steps).length));
  };

  const onCardInfoNext = async () => {
    setSelectedStep(Math.min((selectedStep + 1), Object.keys(Steps).length));
    onRegister();
  };

  const onRegister = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(apiURL + 'api/v1/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "first_name": firstName,
          "last_name": lastName,
          "email": emailAddress,
          "password": password
        })
      });
      console.log("response");
      console.log(response);
      const rsp = await response.json();
      console.log("rsp--------------------------------");
      console.log(rsp);
      if (response.status >= 200 && response.status < 300) {
        console.log("rsp: ", rsp);
        if (rsp.payload) {
          toast("Register successfully! Please verify your Email to login.");
          router.replace('/login');
        } else {
          handleAPIError(rsp);
          setIsLoading(false);
        }
      } else {
        handleAPIError(rsp);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("error--------------------------------");
      console.log(error);
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

            <button className="main-button-mac31cas" type="submit">
              Next
            </button>

            <div className='back-action-31ca22'>
              <MoveLeft color="#b78727" size={23} />
              <Link href="/login">
                <span className="back-2fk29a">Go To Login</span>
              </Link>
            </div>
          </form>
        </ValidatedForm>
      </div>
    );
  }

  const renderPlans = () => {
    return (
      <div className={"form-139nc3"}>
        <form onSubmit={onPlanSelectionNext}>
          <h3 className='form-title-130mcad'>Select Plan</h3>
          <div className="pricing-card-da2fma">
            <div className="card-header-ea21caw">
              <div className="card-btn-parent-1mqidn">
                {SubscriptionPlans.map((item, index) => {
                  return (
                    <button
                      key={index}
                      className={selectedPlan.id == item.id ? "active" : undefined}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedPlan(item)
                      }}
                    >
                      {item.name}
                    </button>
                  );
                })}
                <div className="overlay"></div>
              </div>
            </div>
            <div className="card-body-mzc29q">
              {SubscriptionPlans.map((item, index) => {
                return (
                  <div key={index} id={item.id} className={selectedPlan.id == item.id ? "active" : undefined}>
                    <div className="card-plans-cnq27as">
                      <span className="plan-tag-23an1cz">{item.name}</span>
                      <div className="card-sub-plan-mcai2bc">
                        <h3 className="plan-title-nc17ab">{item.price}</h3>
                        <h6 className="plan-duration-mc81bd"> / {item.duration}</h6>
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
                  </div>
                )
              })}
            </div>
          </div>

          <button className="main-button-mac31cas" type="submit">Select</button>

          <div className='back-action-31ca22'>
            <MoveLeft color="#b78727" size={23} />
            <div onClick={() => setSelectedStep(Math.max((selectedStep - 1), 1))}>
              <span className="back-2fk29a">Back</span>
            </div>
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
            billingAddress: {
              required: true,
              billingAddress: true,
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
            billingAddress: {
              required: "Billing address is required!",
              billingAddress: "Invalid Billing Address",
            },
          }}
          onSubmit={onCardInfoNext}
        >
          <form >
            <h3 className='form-title-130mcad'>Enter Credit Card</h3>
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
                maxLength={5}
                className="form-control-3mac82n"
                placeholder="Expiration Date (MM/YY)"
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
                placeholder="CVV"
                autoComplete="off"
                value={cvv}
                onChange={(event) =>
                  setCVV(event.target.value)
                }
              />
            </div>
            <div>
              <input
                type="text"
                name="billingAddress"
                className="form-control-3mac82n"
                placeholder="Billing Address"
                autoComplete="off"
                value={billingAddress}
                onChange={(event) =>
                  setBillingAddress(event.target.value)
                }
              />
            </div>

            <Button className="main-button-mac31cas" isLoading={isLoading} fullWidth radius='sm' size='lg' type='submit' color='' spinner={<Spinner color='current' size='sm' />}>
              Submit
            </Button>

            <div className='back-action-31ca22'>
              <MoveLeft color="#b78727" size={23} />
              <div onClick={() => setSelectedStep(Math.max((selectedStep - 1), 1))}>
                <span className="back-2fk29a">Back</span>
              </div>
            </div>
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
