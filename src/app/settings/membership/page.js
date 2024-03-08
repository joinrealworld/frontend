"use client";

import React, { useEffect, useState } from "react";
import { GemIcon, MenuIcon, Trash2Icon } from 'lucide-react';
import { useDispatch } from 'react-redux';
import $ from 'jquery';
import { useRouter } from 'next/navigation';
import { Button, Modal, ModalBody, ModalContent, ModalHeader, Switch, useDisclosure } from "@nextui-org/react";
import Image from "next/image";

import './../styles.css';
import './styles.css';
import SettingsMenu from "@/components/SettingsMenu";
import connect from '@/components/ConnectStore/connect';
import ValidatedForm from "@/components/ValidatedForm";

const sampleCard = {
  "id": "card_1MvoiELkdIwHu7ixOeFGbN9D",
  "object": "card",
  "address_city": null,
  "address_country": null,
  "address_line1": null,
  "address_line1_check": null,
  "address_line2": null,
  "address_state": null,
  "address_zip": null,
  "address_zip_check": null,
  "brand": "Visa",
  "country": "US",
  "customer": "cus_NhD8HD2bY8dP3V",
  "cvc_check": null,
  "dynamic_last4": null,
  "exp_month": 4,
  "exp_year": 2024,
  "fingerprint": "mToisGZ01V71BCos",
  "funding": "credit",
  "last4": "4242",
  "metadata": {},
  "name": null,
  "tokenization_method": null,
  "wallet": null
};

function Membership(props) {

  useEffect(() => {
    if (!props.user.isLoggedIn) {
      router.push('/login');
    } else {
      // get data
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
  const [billingAddress, setBillingAddress] = useState('');
  const [cards, setCards] = useState([sampleCard, sampleCard]);

  const onSubmitCardInfo = () => {

  }

  // const onSubmitCardInfo = () => {

  // }

  const onToggleMenu = (e) => {
    $('#setting-menu').toggleClass("invisible");
    $('#setting-menu').toggleClass("visible");
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
        <div className='content-3mcnaj3zcs'>

          <div className='account-info-9c7as'>
            <b className="info-title-mczw72b">My Plan - The Real World</b>
            <div className="info-cards-9anc2j">
              <div className="info-card-9cajyk">
                <div style={{ flexDirection: 'row', alignItems: 'center', display: 'flex' }}>
                  <GemIcon color="var(--fourth-color)" size={25} />
                  <div style={{ marginLeft: 20, flexDirection: 'column', display: 'flex' }}>
                    <span className="info-lable-7cban2d">
                      plan
                    </span>
                    <span className="info-value-7cban2d">
                      Comet
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 10, marginBottom: 10, flexDirection: 'row', alignItems: 'center', display: 'flex' }}>
                <span className="info-value-7cban2d" style={{ fontSize: 30, marginRight: 8 }}>
                  $299
                </span>
                <span className="info-lable-7cban2d" style={{ fontSize: 20 }}>
                  / monthly
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
                    •••• 4242
                  </span>
                  <span className="card-expiry-ma82ba" style={{ marginLeft: 15 }}>
                    12/25
                  </span>
                </div>

                <div className="card-manage-ma82ba" onClick={manageCardModel.onOpen}>
                  <p>Manage</p>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                  {cards.map((card, index) => {
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
                            {card.exp_month}/{card.exp_year}
                          </span>
                        </div>
                        <Trash2Icon color={'black'} size={17} style={{ marginRight: 8, cursor: 'pointer' }} />
                        {/* <p className="text-color-73bab mb-0" style={{ fontSize: 12 }}>Default</p> */}
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
                  onSubmit={onSubmitCardInfo}
                >
                  <form >
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
                        maxLength={5}
                        className="card-input-3mac82n"
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
                        className="card-input-3mac82n"
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
                        className="card-input-3mac82n"
                        placeholder="Billing Address"
                        autoComplete="off"
                        value={billingAddress}
                        onChange={(event) =>
                          setBillingAddress(event.target.value)
                        }
                      />
                    </div>

                    <button className="main-button-23fa2wd" type="submit">
                      Save Card Information
                    </button>
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
