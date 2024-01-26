import React from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { UserIcon, ArrowLeft, Aperture, Edit, TargetIcon, LogOutIcon, LockIcon, AwardIcon, LifeBuoyIcon, X, } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import $ from "jquery";

import './styles.css';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';

// zzz
export const SettingsMenuOptions = [
    { Text: 'Account', Value: 1, Route: '/settings/account', Icon: <UserIcon color='#ededed' size={22} style={{ marginRight: 12 }} /> },
    { Text: 'Membership', Value: 2, Route: '/settings/membership', Icon: <AwardIcon color='#ededed' size={22} style={{ marginRight: 12 }} /> },
    { Text: 'Profile', Value: 3, Route: '/settings/profile', Icon: <Aperture color='#ededed' size={22} style={{ marginRight: 12 }} /> },
    { Text: 'Preference', Value: 4, Route: '/settings/preference', Icon: <Edit color='#ededed' size={22} style={{ marginRight: 12 }} /> },
    { Text: 'Refer a friend', Value: 5, Route: '/settings/referral', Icon: <TargetIcon color='#ededed' size={22} style={{ marginRight: 12 }} /> },
    { Text: 'Feedback', Value: 6, Route: '/settings/feedback', Icon: <LifeBuoyIcon color='#ededed' size={22} style={{ marginRight: 12 }} /> }
]

function SettingsMenu(props) {

    const dispatch = useDispatch();
    const router = useRouter();
    const path = usePathname();

    const logoutPopup = useDisclosure({
        id: 'logout-popup',
    });

    const onLogoutClick = (e) => {
        e.preventDefault();
        logoutPopup.onOpen();
    };

    const onLogoutProcess = () => {
        dispatch(props.actions.userLogout());
        router.replace('/');
    }

    const onBack = (e) => {
        router.replace('/courses');
    }

    const onToggleMenu = (e) => {
        $('#setting-menu').toggleClass("visible");
    }

    const onNavigateMenu = (item) => {
        router.push(item.Route);
        setTimeout(() => {
            $('#setting-menu').toggleClass("visible");
        }, 700);
    }

    return (
        <div className='left-menu-mca32cw' id="setting-menu">
            <div style={{ padding: 20, flexDirection: 'row', display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between', marginBottom: 15 }}>
                <div className='backq-icon-n82nz' style={{ cursor: 'pointer' }} onClick={onBack}>
                    <ArrowLeft color='#ededed' size={22} style={{ marginRight: 12 }} />
                </div>
                <div className='close-icon-n82nz' style={{ cursor: 'pointer' }} onClick={onToggleMenu}>
                    <X color='#ededed' size={22} />
                </div>
            </div>
            <h2 className='title-3oanz3a'>Settings</h2>
            <div className='menu-9zscn2'>
                {SettingsMenuOptions.map((item, index) => {
                    let className = item.Route == path ? 'menu-active-2mczn3' : 'menu-name-2mczn3';
                    return (
                        <div key={index} className={className} onClick={(e) => onNavigateMenu(item)}>
                            {item.Icon}
                            <span>
                                {item.Text}
                            </span>
                        </div>
                    );
                })}
            </div>
            <div className='menu-footer-9zscn2'>
                <div className='menu-name-2mczn3' onClick={onLogoutClick}>
                    <LogOutIcon color='#ededed' size={22} style={{ marginRight: 12 }} />
                    <span>
                        Logout
                    </span>
                </div>
                <div className='menu-name-2mczn3'>
                    <LockIcon color='#ededed' size={22} style={{ marginRight: 12 }} />
                    <span>
                        Logout All Devices
                    </span>
                </div>
            </div>
            <Modal id="logout-popup" isOpen={logoutPopup.isOpen} onOpenChange={logoutPopup.onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Logout</ModalHeader>
                            <ModalBody style={{ marginTop: -10 }}>
                                <p>
                                    Are you sure you want to logout of this device?
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="default" variant="light" onPress={onClose}>
                                    CANCEL
                                </Button>
                                <Button color='primary' onPress={onLogoutProcess}>
                                    LOGOUT
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