"use client";
import React, { useEffect, useState } from "react";
import { FacebookIcon, MailIcon, MenuIcon } from "lucide-react";
import { Button } from "@nextui-org/react";
import { EmailShareButton, FacebookShareButton, TwitterShareButton, WhatsappShareButton } from "react-share";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import $ from 'jquery';

import "./../styles.css";
import "./style.css";
import SettingsMenu from "@/components/SettingsMenu";
import connect from '@/components/ConnectStore/connect';
import { frontEndURL } from '@/constant/global';

function Referral(props) {

  const router = useRouter();

  const referralURL = `${frontEndURL}?ref=${props.user?.user?.referral_code}`;

  const [copyText, setCopyText] = useState("");

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(referralURL);
    setCopyText("Copied!");
    setTimeout(() => {
      setCopyText("");
    }, 1000);
  };

  useEffect(() => {
    if (!props.user.isLoggedIn) {
      router.push('/login');
    }
  }, []);

  const onToggleMenu = (e) => {
    $('#setting-menu').toggleClass("invisible");
    $('#setting-menu').toggleClass("visible");
  }

  return (
    <div className="container-kab38c">
      <SettingsMenu {...props} />
      <div className="right-side-8cnac">
        <div className='w-full align-left' id="menu-icon">
          <MenuIcon
            color="var(--fourth-color)"
            style={{ marginBottom: 20, cursor: 'pointer', marginLeft: '5%', textAlign: 'left' }}
            onClick={onToggleMenu}
          />
        </div>
        <div className="content-3mcnaj3zcs">

          <h5 style={{ color: "var(--fourth-color)" }}>Refer a Friend</h5>

          <b className="info-title-basg2ba">Share your site by copying the URL and sending it to your friends.</b>

          <div className="url-box-73asn">
            <div className="url-73asn">
              <p>{referralURL}</p>
            </div>
            <Button disabled={copyText != ""} className="url-copy-button-73asn" radius="none" onClick={(e) => copyToClipboard()}>
              {copyText ? copyText : "Copy"}
            </Button>
          </div>

          <div style={{ display: 'flex', marginTop: 20, marginBottom: 10, alignItems: 'center', flexDirection: 'row', alignSelf: 'center' }}>
            <p style={{ marginBottom: 0, color: 'var(--fourth-color)' }}>Share to</p>
            <div className="social-icon-3nckan">
              <WhatsappShareButton url={referralURL}>
                <Image alt="WhatsApp" src="/assets/WhatsappIcon.png" width={18} height={18} />
              </WhatsappShareButton>
            </div>
            <div className="social-icon-3nckan">
              <FacebookShareButton url={referralURL}>
                <FacebookIcon color="#ededed" size={20} />
              </FacebookShareButton>
            </div>
            <div className="social-icon-3nckan">
              <TwitterShareButton url={referralURL}>
                <Image alt="X" src="/assets/XIcon.png" width={16} height={16} />
              </TwitterShareButton>
            </div>
            <div className="social-icon-3nckan">
              <EmailShareButton url={referralURL}>
                <MailIcon color="#ededed" size={20} />
              </EmailShareButton>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default connect(Referral);
