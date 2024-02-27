"use client";

import { useEffect, useState } from 'react'
import Link from 'next/link';
import { AtSign, KeyIcon, Edit3Icon, MenuIcon, LockIcon } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import $ from 'jquery';
import Image from 'next/image';
import { Modal, ModalBody, ModalContent, ModalHeader, Switch, useDisclosure } from '@nextui-org/react';

import './../styles.css';
import './styles.css';
import SettingsMenu from "@/components/SettingsMenu";
import connect from '@/components/ConnectStore/connect';
import ValidatedForm from '@/components/ValidatedForm';
import { apiURL } from '@/constant/global';
import { toast } from 'react-toastify';
import Loading from '@/components/Loading';

function Account(props) {


  const dispatch = useDispatch();
  const router = useRouter();

  const [user, setUser] = useState(props.user?.user);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [is2FAEnabled, setIs2FAEnabled] = useState(user?.is_two_factor_enabled); // zzz

  useEffect(() => {
    if (!props.user.isLoggedIn) {
      router.push('/login');
    } else {
      // get data
      getProfile(props.user.authToken);
    }
  }, []);

  const getProfile = async (authToken) => {
    const response = await fetch(apiURL + 'api/v1/user/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authToken
      }
    });
    if (response.status >= 200 && response.status < 300) {
      const rsp = await response.json();
      console.log("rsp.payload --------------------------------");
      console.log(rsp.payload);
      if (rsp.payload && rsp.payload?.id) {
        setUser(rsp.payload);
        dispatch(props.actions.setUser({
          user: rsp.payload
        }));
      } else {
        if (rsp.message && typeof rsp.message === 'string') {
          toast(rsp.message);
        } else {
          toast("Something went wrong!");
        }
      }
    } else {
      toast("Something went wrong!");
    }
  }

  const changeUserNameModel = useDisclosure({
    id: 'change-username',
  });
  const changePasswordModel = useDisclosure({
    id: 'change-password',
  });

  const onChangeUsernameClick = () => {
    changeUsername(props.user.authToken);
  }

  console.log(props.user.authToken);
  const changeUsername = async (authToken) => {
    const response = await fetch(apiURL + 'api/v1/user/change_username', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authToken
      },
      body: JSON.stringify({
        username: username
      })
    });
    if (response.status >= 200 && response.status < 300) {
      const rsp = await response.json();
      console.log("rsp.payload --------------------------------");
      console.log(rsp.payload);
      if (rsp.payload) {
        toast("Username changed successfully!");
        getProfile(authToken);
      } else {
        if (rsp.message && typeof rsp.message === 'string') {
          toast(rsp.message);
        } else {
          toast("Something went wrong!");
        }
      }
    } else {
      toast("Something went wrong!");
    }
  }

  const onChangePasswordClick = () => {
    changePassword(props.user.authToken);
  }

  const changePassword = async (authToken) => {
    const response = await fetch(apiURL + 'api/v1/user/change_password', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authToken
      },
      body: JSON.stringify({
        old_password: password,
        new_password: newPassword,
      })
    });
    console.log("response --------------------------------");
    console.log(response);
    if (response.status >= 200 && response.status < 300) {
      const rsp = await response.json();
      console.log("rsp.payload --------------------------------");
      console.log(rsp.payload);
      if (rsp.payload) {
        toast("Password changed successfully!");
      } else {
        if (rsp.message && typeof rsp.message === 'string') {
          toast(rsp.message);
        } else {
          toast("Something went wrong!");
        }
      }
    } else {
      toast("Something went wrong!");
    }
  }

  const onToggleMenu = (e) => {
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
          <div className='profile-image-8qnzcmbw'>
            <div style={{ flexDirection: 'row', alignItems: 'center', display: 'flex' }}>
              <Image
                className="avatar-93nasj"
                alt="Avatar"
                src={user?.avatar ? user?.avatar : "/assets/hp.jpg"}
                width={46}
                height={46}
              />
              <div className="user-details-23mas">
                <div style={{ flexDirection: 'row', alignItems: 'center', display: 'flex' }}>
                  <span className="username-312c02qena">{user?.first_name + " " + user?.last_name}</span>
                </div>
                <div style={{ flexDirection: 'row', alignItems: 'center', display: 'flex' }}>
                  <AtSign color="var(--fifth-color)" size={13.5} style={{ marginRight: 2 }} />
                  {/* <InfoIcon color='#c5bfbf' size={14} style={{ marginRight: 4 }} /> */}
                  <span className="tag-kla3mca2">{user?.username}</span>
                </div>
              </div>
            </div>
            <Link href={'/settings/profile'} style={{ cursor: 'pointer' }}>
              <Edit3Icon color="var(--fourth-color)" size={20} />
            </Link>
          </div>

          <div className='account-info-kzh2bw'>
            <b className="info-title-mczw72b">Account Information</b>
            <div className="info-cards-i73cas">
              <div className="info-card-9cajy6">
                <div style={{ flexDirection: 'row', alignItems: 'center', display: 'flex' }}>
                  <AtSign color="var(--fourth-color)" size={25} />
                  <div style={{ marginLeft: 20, flexDirection: 'column', display: 'flex' }}>
                    <span className="info-lable-7cban2d">
                      Username
                    </span>
                    <span className="info-value-ma82ba">
                      {user?.username}
                    </span>
                  </div>
                </div>
                <div style={{ cursor: 'pointer' }} onClick={changeUserNameModel.onOpen}>
                  <Edit3Icon color="var(--fourth-color)" size={20} />
                </div>
              </div>
              <div className="info-card-9cajy6">
                <div style={{ flexDirection: 'row', alignItems: 'center', display: 'flex' }}>
                  <KeyIcon color="var(--fourth-color)" size={25} />
                  <div style={{ marginLeft: 20, flexDirection: 'column', display: 'flex' }}>
                    <span className="info-lable-7cban2d">
                      Password
                    </span>
                    <span className="info-value-ma82ba">
                      ••••••••
                    </span>
                  </div>
                </div>
                <div style={{ cursor: 'pointer' }} onClick={changePasswordModel.onOpen}>
                  <Edit3Icon color="var(--fourth-color)" size={20} />
                </div>
              </div>
            </div>

            <div style={{ marginTop: 15 }}></div>

            <b className="info-title-mczw72b">Two-Factor Authorization</b>
            <div className="info-cards-i73cas">
              <div className="info-card-9cajy6">
                <div style={{ flexDirection: 'row', alignItems: 'center', display: 'flex', marginTop: 10 }}>
                  <LockIcon color='white' size={25} />
                  <div style={{ marginLeft: 20, flexDirection: 'column', display: 'flex' }}>
                    <span className="info-value-ma82ba">
                      Email Authorization
                    </span>
                  </div>
                </div>
                <Switch
                  size="lg"
                  checked={is2FAEnabled}
                  onChange={() => setIs2FAEnabled(!is2FAEnabled)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        id="change-username"
        isOpen={changeUserNameModel.isOpen}
        backdrop="opaque"
        radius="md"
        onClose={() => {
          setUsername('');
          setPassword('');
        }}
        onOpenChange={changeUserNameModel.onOpenChange}
        classNames={{
          body: "py-6 modal-mcan3",
          header: "modal-header-mcan3 border-b-[1px] border-[#292f46]",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-white">Change Username</ModalHeader>
              <ModalBody>
                <ValidatedForm
                  rules={{
                    username: {
                      required: true,
                      minLength: 3,
                      notSameUsername: user?.username
                    },
                  }}
                  messages={{
                    username: {
                      required: "Username is required!",
                      minLength: "Minimum 3 digit is required!",
                      notSameUsername: "Your current username!"
                    },
                  }}
                  onSubmit={onChangeUsernameClick}
                >
                  <form >
                    <div>
                      <input
                        type="text"
                        name="username"
                        className="form-control-7ajb312"
                        placeholder="New Username"
                        value={username}
                        id="username"
                        autoComplete="off"
                        onChange={(event) =>
                          setUsername(event.target.value)
                        }
                      />
                    </div>

                    <button className="main-button-7ajb312" type="submit">
                      Update Username
                    </button>
                  </form>
                </ValidatedForm>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        id="change-password"
        isOpen={changePasswordModel.isOpen}
        backdrop="opaque"
        radius="md"
        onOpenChange={changePasswordModel.onOpenChange}
        classNames={{
          body: "py-6 modal-mcan3",
          header: "modal-header-mcan3 border-b-[1px] border-[#292f46]",
        }}
        onClose={() => {
          setNewPassword('');
          setPassword('');
          setConfirmPassword('');
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-white">Change Password</ModalHeader>
              <ModalBody>
                <ValidatedForm
                  rules={{
                    newPassword: {
                      required: true,
                      minLength: 8,
                    },
                    confirmPassword: {
                      required: true,
                      matches: newPassword
                    },
                    password: {
                      required: true
                    },
                  }}
                  messages={{
                    newPassword: {
                      required: "New Password is required!",
                      minLength: "Minimum 8 digit is required!",
                    },
                    confirmPassword: {
                      required: "Confirm Password is required!",
                      matches: "Confirm Password is matched!",
                    },
                    password: {
                      required: "Current Password is required!",
                    },
                  }}
                  onSubmit={onChangePasswordClick}
                >
                  <form>
                    <div>
                      <span className='fs-6 text-white'>New password</span>
                      <input
                        type="password"
                        name="newPassword"
                        className="form-control-7ajb312"
                        placeholder="New Password"
                        autoComplete="off"
                        value={newPassword}
                        onChange={(event) =>
                          setNewPassword(event.target.value)
                        }
                      />
                      <input
                        type="password"
                        name="confirmPassword"
                        className="form-control-7ajb312"
                        placeholder="Current Password"
                        autoComplete="off"
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                      />
                      <span className='fs-6 text-white'>Confirm your current password</span>
                      <input
                        type="password"
                        name="password"
                        className="form-control-7ajb312"
                        placeholder="Current Password"
                        autoComplete="off"
                        value={password}
                        onChange={(event) =>
                          setPassword(event.target.value)
                        }
                      />
                    </div>

                    <button className="main-button-7ajb312" type="submit">
                      Update Password
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

export default connect(Account);
