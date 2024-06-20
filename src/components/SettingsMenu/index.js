import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { UserIcon, ArrowLeft, Aperture, Edit, TargetIcon, LogOutIcon, LockIcon, AwardIcon, LifeBuoyIcon, X, } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import $ from "jquery";

import './styles.css';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, useDisclosure } from '@nextui-org/react';
import { apiURL } from '@/constant/global';

export const SettingsMenuOptions = [
  { Text: "Account", Value: 1, Route: "/settings/account", Icon: (isSelected) => (<UserIcon color={isSelected ? "#FFFFFF" : "var(--fourth-color)"} size={22} style={{ marginRight: 12 }} />), },
  { Text: "Membership", Value: 2, Route: "/settings/membership", Icon: (isSelected) => (<AwardIcon color={isSelected ? "#FFFFFF" : "var(--fourth-color)"} size={22} style={{ marginRight: 12 }} />), },
  { Text: "Profile", Value: 3, Route: "/settings/profile", Icon: (isSelected) => (<Aperture color={isSelected ? "#FFFFFF" : "var(--fourth-color)"} size={22} style={{ marginRight: 12 }} />), },
  { Text: "Preference", Value: 4, Route: "/settings/preference", Icon: (isSelected) => (<Edit color={isSelected ? "#FFFFFF" : "var(--fourth-color)"} size={22} style={{ marginRight: 12 }} />), },
  { Text: "Refer a Friend", Value: 5, Route: "/settings/referral", Icon: (isSelected) => (<TargetIcon color={isSelected ? "#FFFFFF" : "var(--fourth-color)"} size={22} style={{ marginRight: 12 }} />), },
  { Text: "Feedback", Value: 6, Route: "/settings/feedback", Icon: (isSelected) => (<LifeBuoyIcon color={isSelected ? "#FFFFFF" : "var(--fourth-color)"} size={22} style={{ marginRight: 12 }} />), },
];

function SettingsMenu(props) {

  const dispatch = useDispatch();
  const router = useRouter();
  const path = usePathname();

  const [isBtnLoading, setIsBtnLoading] = useState(false);

  const logoutPopup = useDisclosure({
    id: 'logout-popup',
  });

  const allDeviceLogoutPopup = useDisclosure({
    id: 'all-device-logout-popup',
  });

  useEffect(() => {
    const onResizeWindow = (e) => {
      if (window.innerWidth < 800) {
        $('#setting-menu').addClass("invisible");
        $('#setting-menu').removeClass("visible");
      } else {
        $('#setting-menu').addClass("visible");
        $('#setting-menu').removeClass("invisible");
      }
    };
    onResizeWindow(null);
    window.addEventListener('resize', onResizeWindow);
    return () => {
      window.removeEventListener('resize', onResizeWindow)
    };
  }, []);

  const onLogoutClick = (e) => {
    e.preventDefault();
    onToggleMenu();
    logoutPopup.onOpen();
  };

  const onLogoutProcess = async () => {
    setIsBtnLoading(true);
    try {
      await fetch(apiURL + 'api/v1/user/logout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + props.user.authToken
        }
      });
    } catch (error) {

    } finally {
      dispatch(props.actions.userLogout());
      router.replace('/');
    }
  }

  const onAllLogoutClick = (e) => {
    e.preventDefault();
    onToggleMenu();
    allDeviceLogoutPopup.onOpen();
  };

  const onAllLogoutProcess = async () => {
    setIsBtnLoading(true);
    try {
      await fetch(apiURL + 'api/v1/user/all_logout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + props.user.authToken
        }
      });
    } catch (error) {

    } finally {
      dispatch(props.actions.userLogout());
      router.replace('/');
    }
  }

  const onBack = (e) => {
    router.push('/');
  }

  const onToggleMenu = () => {
    if (window.innerWidth < 800) {
      $('#setting-menu').toggleClass("invisible");
      $('#setting-menu').toggleClass("visible");
    }
  }

  const onNavigateMenu = (item) => {
    router.push(item.Route);
    onToggleMenu();
  }

  return (
    <div className="left-menu-mca32cw" id="setting-menu">
      <div
        style={{
          paddingLeft: 20,
          flexDirection: "row",
          display: "flex",
          alignItems: "center",
          width: "100%",
          justifyContent: "space-between",
          marginBottom: 15,
        }}
      >
        <div
          className="backq-icon-n82nz"
          style={{ cursor: "pointer" }}
          onClick={onBack}
        >
          <ArrowLeft
            color="var(--fourth-color)"
            size={22}
            style={{ marginRight: 12 }}
          />
        </div>
        <div
          className="close-icon-n82nz"
          style={{ cursor: "pointer" }}
          onClick={(e) => onToggleMenu()}
        >
          <X color="var(--fourth-color)" size={22} />
        </div>
      </div>
      <h2 className="title-3oanz3a">Settings</h2>
      <div className="menu-9zscn2">
        {SettingsMenuOptions.map((item, index) => {
          let className =
            item.Route == path ? "menu-active-2mczn3" : "menu-name-2mczn3";
          return (
            <div
              key={index}
              className={className}
              onClick={(e) => onNavigateMenu(item)}
            >
              {item.Icon(item.Route == path)}
              <span>{item.Text}</span>
            </div>
          );
        })}
      </div>
      <div className="menu-footer-9zscn2">
        <div className="menu-name-2mczn3" onClick={onLogoutClick}>
          <LogOutIcon
            color="var(--fourth-color)"
            size={22}
            style={{ marginRight: 12 }}
          />
          <span>Logout</span>
        </div>
        <div className="menu-name-2mczn3" onClick={onAllLogoutClick}>
          <LockIcon
            color="var(--fourth-color)"
            size={22}
            style={{ marginRight: 12 }}
          />
          <span>Logout All Devices</span>
        </div>
      </div>
      <Modal
        id="logout-popup"
        isOpen={logoutPopup.isOpen}
        backdrop="opaque"
        radius="md"
        onOpenChange={logoutPopup.onOpenChange}
        classNames={{
          body: "py-6 modal-mcan3",
          header: "modal-header-mcan3 border-b-[1px] border-[#292f46]",
          footer: "modal-header-mcan3 border-b-[1px] border-[#292f46]",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='modal-title-mcan3'>Logout</ModalHeader>
              <ModalBody style={{ marginTop: -10 }}>
                <span className='modal-title-mcan3'>
                  Are you sure you want to logout of this device?
                </span>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" className='side-button-23nfkw3Z' style={{ marginLeft: 30 }} radius='sm' size='lg' color='' onClick={onClose}>
                  CANCEL
                </Button>
                <Button className='main-button-23nfkw3Z' isLoading={isBtnLoading} spinner={<Spinner color='current' size='sm' />} radius='sm' size='lg' type='submit' color='' onPress={onLogoutProcess}>
                  LOGOUT
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        id="all-device-logout-popup"
        isOpen={allDeviceLogoutPopup.isOpen}
        backdrop="opaque"
        radius="md"
        onOpenChange={allDeviceLogoutPopup.onOpenChange}
        classNames={{
          body: "py-6 modal-mcan3",
          header: "modal-header-mcan3 border-b-[1px] border-[#292f46]",
          footer: "modal-header-mcan3 border-b-[1px] border-[#292f46]",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='modal-title-mcan3'>Logout All Devices</ModalHeader>
              <ModalBody style={{ marginTop: -10 }}>
                <span className='modal-title-mcan3'>
                  Are you sure you want to logout of all signed in devices?
                </span>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" className='side-button-23nfkw3Z' style={{ marginLeft: 30 }} radius='sm' size='lg' color='' onClick={onClose}>
                  CANCEL
                </Button>
                <Button className='main-button-23nfkw3Z' isLoading={isBtnLoading} spinner={<Spinner color='current' size='sm' />} radius='sm' size='lg' type='submit' color='' onPress={onAllLogoutProcess}>
                  LOGOUT ALL DEVICES
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default SettingsMenu;