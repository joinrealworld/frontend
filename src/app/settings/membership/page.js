"use client";

import React, { useEffect, useState } from "react";
import { GemIcon, MenuIcon, Trash2Icon } from 'lucide-react';
import { useDispatch } from 'react-redux';
import $ from 'jquery';
import { useRouter } from 'next/navigation';
import { Button, Modal, ModalBody, ModalContent, ModalHeader, Spinner, Switch, useDisclosure } from "@nextui-org/react";
import Image from "next/image";

import './../styles.css';
import './styles.css';
import SettingsMenu from "@/components/SettingsMenu";
import connect from '@/components/ConnectStore/connect';
import ValidatedForm from "@/components/ValidatedForm";
import { apiURL, handleAPIError } from "@/constant/global";
import { toast } from "react-toastify";
import moment from "moment";

function Membership(props) {

  useEffect(() => {
    const getData = async () => {
      // get data
      await getCardList(props.user.authToken);
      await getCustomer(props.user.authToken);
      await getSubscription(props.user.authToken);
    }
    if (!props.user.isLoggedIn) {
      router.push('/login');
    } else {
      getData();
    }
  }, []);

  const dispatch = useDispatch();
  const router = useRouter();
  const [isSubscribed, setIsSubscribed] = useState(true);
  const manageCardModel = useDisclosure({
    id: 'manage-card'
  });
  const addCardModel = useDisclosure({
    id: 'add-card'
  });
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCVV] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [currentPlan, setCurrentPlan] = useState(null);
  const [savedCards, setSavedCards] = useState([]);
  const [isLoadingAddCard, setIsLoadingAddCard] = useState(false);
  const [customer, setCustomer] = useState(null);

  const getSubscription = async (authToken) => {
    console.log("authToken ----------------");
    console.log(authToken);
    const response = await fetch(apiURL + 'api/v1/payment/retrive_subscription', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authToken
      }
    });
    console.log("response --------------------------------");
    console.log(response);
    const rsp = await response.json();
    if (response.status >= 200 && response.status < 300) {
      console.log("rsp.payload --------------------------------");
      console.log(JSON.stringify(rsp));
      if (rsp.payload && rsp.payload?.plan) {
        setCurrentPlan(rsp.payload);
      } else {
        handleAPIError(rsp);
      }
    } else {
      if (response.status == 401) {
        dispatch(props.actions.userLogout());
      } else {
        handleAPIError(rsp);
      }
    }
  }

  const getCustomer = async (authToken) => {
    const response = await fetch(apiURL + 'api/v1/payment/fetch/None/customer', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authToken
      }
    });
    console.log("response --------------------------------");
    console.log(response);
    const rsp = await response.json();
    if (response.status >= 200 && response.status < 300) {
      if (rsp.payload && rsp.payload) {
        setCustomer(rsp.payload);
      } else {
        handleAPIError(rsp);
      }
    } else {
      if (response.status == 401) {
        dispatch(props.actions.userLogout());
      }
    }
  }

  const getCardList = async (authToken) => {
    const response = await fetch(apiURL + 'api/v1/payment/card_list', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authToken
      }
    });
    console.log("response --------------------------------");
    console.log(response);
    const rsp = await response.json();
    if (response.status >= 200 && response.status < 300) {
      console.log("rsp.payload --------------------------------");
      console.log(rsp);
      if (rsp.payload && rsp.payload?.object == 'list' && rsp.payload?.data?.length > 0) {
        setSavedCards(rsp.payload?.data);
      } else {
        handleAPIError(rsp);
      }
    } else {
      if (response.status == 401) {
        dispatch(props.actions.userLogout());
      } else {
        handleAPIError(rsp);
      }
    }
  }

  const onSubmitCardInfo = async () => {
    try {
      setIsLoadingAddCard(true);
      let formData = new FormData();
      formData.append('card_number', cardNumber);
      formData.append('card_exp_month', expiryDate.split('/')[0]);
      formData.append('card_exp_year', expiryDate.split('/')[1]);
      formData.append('card_cvc', cvv);
      formData.append('card_name', cardHolder);
      const response = await fetch(apiURL + 'api/v1/payment/create_card_token', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + props.user.authToken
        },
        body: formData
      });
      console.log("response");
      console.log(response);
      const rsp = await response.json();
      console.log("rsp--------------------------------");
      console.log(rsp);
      if (response.status >= 200 && response.status < 300) {
        console.log("rsp: ", rsp);
        if (rsp.payload) {
          toast("Card added successfully!");
          addCardModel.onClose();
          manageCardModel.onClose();
        } else {
          handleAPIError(rsp);
          setIsLoadingAddCard(false);
        }
      } else {
        handleAPIError(rsp);
        setIsLoadingAddCard(false);
      }
    } catch (error) {
      console.log("error--------------------------------");
      console.log(error);
      toast("Something went wrong!");
      setIsLoadingAddCard(false);
    }
  }

  // const onSubmitCardInfo = () => {

  // }

  const onToggleMenu = (e) => {
    $('#setting-menu').toggleClass("invisible");
    $('#setting-menu').toggleClass("visible");
  }

  const renderCurrentPlan = () => {
    return (
      <div className='content-3mcnaj3zcs'>

        <div className='account-info-9c7as'>
          <b className="info-title-mczw72b">My Plan - The Real World</b>
          <div className="info-cards-9anc2j">
            <div className="info-card-9cajyk">
              <div style={{ flexDirection: 'row', alignItems: 'center', display: 'flex' }}>
                <GemIcon color="var(--fourth-color)" size={25} />
                <div style={{ marginLeft: 20, flexDirection: 'column', display: 'flex' }}>
                  <span className="info-lable-7cban2d">
                    Plan
                  </span>
                  <span className="info-value-7cban2d">
                    {currentPlan?.plan?.nickname}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 10, marginBottom: 10, flexDirection: 'row', alignItems: 'center', display: 'flex' }}>
              <span className="info-value-7cban2d" style={{ fontSize: 30, marginRight: 8 }}>
                ${currentPlan?.plan?.amount / 100}
              </span>
              <span className="info-lable-7cban2d" style={{ fontSize: 20 }}>
                / {currentPlan?.plan?.interval_count} {currentPlan?.plan?.interval}
              </span>
            </div>
            <div style={{ marginTop: 10, marginBottom: 5, flexDirection: 'row', alignItems: 'center', display: 'flex' }}>
              <span className="info-lable-7cban2d" style={{ fontSize: 16, marginRight: 8 }}>
                Started on
              </span>
              <span className="info-value-7cban2d" style={{ fontSize: 16 }}>
                {moment.unix(currentPlan?.current_period_start).format('DD MMM, YYYY')}
              </span>
            </div>
            <div style={{ marginBottom: 10, flexDirection: 'row', alignItems: 'center', display: 'flex' }}>
              <span className="info-lable-7cban2d" style={{ fontSize: 16, marginRight: 8 }}>
                Renews on
              </span>
              <span className="info-value-7cban2d" style={{ fontSize: 16 }}>
                {moment.unix(currentPlan?.current_period_end).format('DD MMM, YYYY')}
              </span>
            </div>
            <div className="info-card-9cajyk" style={{ paddingLeft: 0 }}>
              <div style={{ flexDirection: 'row', alignItems: 'center', display: 'flex' }}>
                <span className="info-value-7cban2d" >
                  Active
                </span>
              </div>

              <Switch
                size="lg"
                defaultSelected
                checked={isSubscribed}
                onChange={() => setIsSubscribed(!isSubscribed)}
              />
            </div>
            <div className="info-card-9cajyk" style={{ paddingLeft: 0 }}>
              <div style={{ flexDirection: 'row', alignItems: 'center', display: 'flex' }}>
                <Image
                  src={"https://www.mastercard.co.in/content/dam/public/mastercardcom/in/en/logos/mc-logo-52.svg"}
                  height={200}
                  width={200}
                  className="card-logo-3mcal2"
                  priority
                />
                <span className="card-number-ma82ba" style={{ marginLeft: 15 }}>
                  •••• {savedCards?.[0]?.last4 ?? "4242"}
                </span>
                <span className="card-expiry-ma82ba" style={{ marginLeft: 15 }}>
                  {String(savedCards?.[0]?.exp_month).padStart(2, 0) ?? "12"}/{savedCards?.[0]?.exp_year ?? new Date().getFullYear() + 2}
                </span>
              </div>

              <div className="card-manage-ma82ba" onClick={manageCardModel.onOpen}>
                <p>Manage</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='container-kab38c'>
      <SettingsMenu {...props} />

      <div className='right-side-8cnac'>
        <div className='w-full align-left' id="menu-icon">
          <MenuIcon
            color="var(--fourth-color)"
            style={{ marginBottom: 20, cursor: 'pointer', marginLeft: '5%', textAlign: 'left' }}
            onClick={onToggleMenu}
          />
        </div>

        {currentPlan ? renderCurrentPlan() : null}

      </div>
      <Modal
        id="manage-card"
        isOpen={manageCardModel.isOpen}
        backdrop="opaque"
        radius="md"
        onOpenChange={manageCardModel.onOpenChange}
        classNames={{
          body: "py-6 modal-mcan3",
          header: "modal-header-mcan3 border-b-[1px] border-[#292f46]",
          footer: "modal-mcan3",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="modal-title-8bca382 flex flex-col gap-1">Manage Payment</ModalHeader>
              <ModalBody>
                <div>
                  {savedCards.map((card, index) => {
                    return (
                      <div key={index} style={{ marginTop: index == 0 ? 0 : 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', display: 'flex' }}>
                        <div style={{ flexDirection: 'row', alignItems: 'center', display: 'flex' }}>
                          <Image
                            src={"https://www.mastercard.co.in/content/dam/public/mastercardcom/in/en/logos/mc-logo-52.svg"}
                            height={200}
                            width={200}
                            className="card-logo-3mcal2"
                            priority
                          />
                          <span className="card-number-ma82ba" style={{ marginLeft: 20 }}>
                            •••• {card.last4}
                          </span>
                          <span className="card-expiry-ma82ba" style={{ marginLeft: 20 }}>
                            {String(card.exp_month).padStart(2, 0)}/{card.exp_year}
                          </span>
                        </div>

                        {card.id == customer?.default_source ?
                          <p className="text-color-73bab mb-0" style={{ fontSize: 13 }}>Default</p>
                          :
                          <Trash2Icon color="var(--fourth-color)" size={17} style={{ marginRight: 8, cursor: 'pointer' }} />
                        }
                      </div>
                    );
                  })}

                  <button className="main-button-23fa2wd" onClick={() => {
                    onClose();
                    addCardModel.onOpen();
                  }}>
                    + ADD PAYMENT METHOD
                  </button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        id="add-card"
        isOpen={addCardModel.isOpen}
        onOpenChange={addCardModel.onOpenChange}
        onClose={manageCardModel.onOpen}
        classNames={{
          body: "py-6 modal-mcan3",
          header: "modal-header-mcan3 border-b-[1px] border-[#292f46]",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="modal-title-8bca382 flex flex-col gap-1">Add Payment Method</ModalHeader>
              <ModalBody>
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
                  onSubmit={onSubmitCardInfo}
                >
                  <form >
                    <div>
                      <input
                        type="text"
                        name="cardHolder"
                        className="card-input-3mac82n"
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
                        className="card-input-3mac82n"
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
                        className="card-input-3mac82n"
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
                        className="card-input-3mac82n"
                        placeholder="CVV"
                        autoComplete="off"
                        value={cvv}
                        onChange={(event) =>
                          setCVV(event.target.value)
                        }
                      />
                    </div>

                    <Button className='main-button-23fa2wd' isLoading={isLoadingAddCard} spinner={<Spinner color='current' size='sm' />} fullWidth radius='sm' size='lg' type='submit' color=''>
                      Save Card Information
                    </Button>
                  </form>
                </ValidatedForm>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default connect(Membership);
