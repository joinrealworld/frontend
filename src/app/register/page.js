"use client";

import { useState } from 'react'
import Link from 'next/link';
import { MoveLeft } from 'lucide-react';
import validator from "validator";
import { useDispatch } from 'react-redux';

import './styles.css';
import ValidatedForm from "../../components/ValidatedForm";
import { connect } from '@/components/ConnectStore/connect';
import { apiURL } from '@/constant/global';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


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

  const [emailAddress, setEmailAddress] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCVV] = useState('');
  const [billingAddress, setBillingAddress] = useState('');

  const [selectedPlan, setSelectedPlan] = useState(SubscriptionPlans[0]);
  const [selectedStep, setSelectedStep] = useState(Steps.personalInfo);

  const onPersonalInfoNext = async () => {
    setSelectedStep(Math.min((selectedStep + 1), Object.keys(Steps).length))
  };

  const onPlanSelectionNext = async () => {
    setSelectedStep(Math.min((selectedStep + 1), Object.keys(Steps).length))
  };

  const onCardInfoNext = async () => {
    alert("Register successfully!");
    // setSelectedStep(Math.min((selectedStep + 1), Object.keys(Steps).length))
  };

  if (props.user.isLoggedIn) {
    router.push('/');
    return null;
  }

  const renderPersonalInfo = () => {
    return (
      <div className={"form flex flex-col gap-7 mt-8 mb-8 self-center"}>
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
              required: "First name is required!"
            },
          }}
          onSubmit={onPersonalInfoNext}
        >
          <form >
            <h3>Personal Information</h3>
            <div>
              <input
                type="text"
                name="emailAddress"
                className="form-control"
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
                className="form-control"
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
                className="form-control"
                placeholder="Last Name"
                autoComplete="off"
                value={lastName}
                onChange={(event) =>
                  setLastName(event.target.value)
                }
              />
            </div>

            <div className="d-grid mt-[20px]">
              <button className="main-button btn btn-primary" type="submit">
                Next
              </button>
            </div>
            <div className='back-action'>
              <MoveLeft color="#b78727" size={23} style={{ marginBottom: 3.5 }} />
              <Link href="/login">
                <p className="back">Go To Login</p>
              </Link>
            </div>
          </form>
        </ValidatedForm>
      </div>
    );
  }

  const renderPlans = () => {
    return (
      <div className={"form flex flex-col gap-7 mt-8 mb-8 self-center"}>
        <form onSubmit={onPlanSelectionNext}>
          <h3>Select Plan</h3>
          <div className="pricing-card">
            <div className="card-header">
              <div className="card-btn-parent">
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
            <div className="card-body">
              {SubscriptionPlans.map((item, index) => {
                return (
                  <div key={index} id="card-basic-plan" className={selectedPlan.id == item.id ? "active" : undefined}>
                    <div className="card-plans">
                      <span className="plan-tag">{item.name}</span>
                      <div className="card-sub-plan">
                        <h3 className="plan-title">{item.price}</h3>
                        <span className="plan-duration"> / {item.duration}</span>
                      </div>
                    </div>
                    <div className="card-content">
                      <p>{item.description}</p>
                      <div className="card-lists">
                        {item.benefits.map((item, index) => {
                          return (
                            <div key={index} className="card-list">
                              <img src="https://rvs-pricing-card.vercel.app/tick.svg" alt="" />
                              <div>
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

          <div className="d-grid mt-[20px]">
            <button className="main-button btn btn-primary" type="submit">Select</button>
          </div>
          <div className='back-action'>
            <MoveLeft color="#b78727" size={23} style={{ marginBottom: 3.5 }} />
            <div onClick={() => setSelectedStep(Math.max((selectedStep - 1), 1))}>
              <p className="back">Back</p>
            </div>
          </div>
        </form>
      </div>
    );
  }


  const renderCardInfo = () => {
    return (
      <div className={"form flex flex-col gap-7 mt-8 mb-8 self-center"}>
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
            <h3>Enter Credit Card</h3>
            <div>
              <input
                type="text"
                name="cardNumber"
                maxLength={16}
                className="form-control"
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
                className="form-control"
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
                className="form-control"
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
                className="form-control"
                placeholder="Billing Address"
                autoComplete="off"
                value={billingAddress}
                onChange={(event) =>
                  setBillingAddress(event.target.value)
                }
              />
            </div>

            <div className="d-grid mt-[20px]">
              <button className="main-button btn btn-primary" type="submit">
                Submit
              </button>
            </div>
            <div className='back-action'>
              <MoveLeft color="#b78727" size={23} style={{ marginBottom: 3.5 }} />
              <div onClick={() => setSelectedStep(Math.max((selectedStep - 1), 1))}>
                <p className="back">Back</p>
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
    <div className="main-body absolute inset-0 flex row justify-content-lg-center justify-content-md-center">

      <div className="login-page">
        <div className="lg:flex mr-[10%]">
          <div className="flex flex-col mt-[25px] text-primary-content text-center items-center">
            <div>
              <Image
                src="/assets/logo-512-84985a75.png"
                alt="Logo"
                className='logo'
                width={200}
                height={200}
                priority
              />
            </div>
            <div className='mt-[18px] ml-[20px]'>
              <p className="lg:text-[28px] font-black text-[25px] mx-auto">
                Join The Real World
              </p>
              <p className="lg:text-[22px] text-[21px] mx-auto mt-[11px]">
                ESCAPE THE MATRIX
              </p>
            </div>
          </div>
        </div>

        {renderContent()}

      </div>
    </div>
  );
}

export default connect(Register);
