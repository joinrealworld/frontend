"use client";

import { useEffect, useState } from 'react'
import Link from 'next/link';
import { AtSign, KeyIcon, Edit3Icon, MenuIcon, LockIcon, InfoIcon, MailIcon, ChevronRightIcon, BinaryIcon } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import $ from 'jquery';
import Image from 'next/image';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, Switch, useDisclosure } from '@nextui-org/react';
import { toast } from 'react-toastify';

import './../styles.css';
import './styles.css';
import SettingsMenu from "@/components/SettingsMenu";
import connect from '@/components/ConnectStore/connect';
import ValidatedForm from '@/components/ValidatedForm';
import { apiURL, handleAPIError } from '@/constant/global';

function Account(props) {

  const dispatch = useDispatch();
  const router = useRouter();

  const [user, setUser] = useState(props.user?.user);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoadingUpdatePassword, setIsLoadingUpdatePassword] = useState(false);
  const [isLoadingUpdateUsername, setIsLoadingUpdateUsername] = useState(false);

  const [isLoadingDisableFA, setIsLoadingDisableFA] = useState(false);
  const [isLoadingConfirmEmail2FA, setIsLoadingConfirmEmail2FA] = useState(false);
  const [isLoadingConfirmCode2FA, setIsLoadingConfirmCode2FA] = useState(false);
  const [code, setCode] = useState('');

  const changeUserNameModel = useDisclosure({
    id: 'change-username',
  });
  const changePasswordModel = useDisclosure({
    id: 'change-password',
  });
  const askCodeModel = useDisclosure({
    id: 'ask-code',
  });
  const askEmailOTPModel = useDisclosure({
    id: 'ask-email-otp',
  });

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
      if (response.status == 401) {
        dispatch(props.actions.userLogout());
      } else {
        toast("Something went wrong!");
      }
    }
  }

  const onChangeUsernameClick = () => {
    setIsLoadingUpdateUsername(true);
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
    const rsp = await response.json();
    if (response.status >= 200 && response.status < 300) {
      if (rsp.payload) {
        toast("Username changed successfully!");
        getProfile(authToken);
        setUsername('');
        changeUserNameModel.onClose();
        setIsLoadingUpdateUsername(false);
      } else {
        handleAPIError(rsp);
        setIsLoadingUpdateUsername(false);
      }
    } else {
      if (response.status == 401) {
        dispatch(props.actions.userLogout());
      } else {
        if (rsp.status == -1 && rsp.payload && (rsp.payload + "").includes('duplicate key value violates unique constraint')) {
          toast("Username already taken!");
        } else {
          handleAPIError(rsp);
        }
        setIsLoadingUpdateUsername(false);
      }
    }
  }

  const onChangePasswordClick = () => {
    setIsLoadingUpdatePassword(true);
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
    const rsp = await response.json();
    console.log("rsp.payload --------------------------------");
    console.log(JSON.stringify(rsp));
    if (response.status >= 200 && response.status < 300) {
      if (rsp.payload) {
        toast("Password changed successfully!");
        changePasswordModel.onClose();
        setNewPassword('');
        setPassword('');
        setConfirmPassword('');
        setIsLoadingUpdatePassword(false);
      } else {
        handleAPIError(rsp);
        setIsLoadingUpdatePassword(false);
      }
    } else {
      if (response.status == 401) {
        dispatch(props.actions.userLogout());
      } else {
        if (response.status == 400 && rsp.payload) {
          console.log(rsp.payload ?? rsp.payload?.new_password?.[0] ?? rsp.payload?.old_password?.[0] ?? "Something went wrong!");
          if (typeof rsp.payload == 'object') {
            toast(rsp.payload?.new_password?.[0] ?? rsp.payload?.old_password?.[0] ?? "Something went wrong!");
          }
          else if (typeof rsp.payload == 'string') {
            toast(rsp.payload ?? "Something went wrong!");
          }
          else {
            handleAPIError(rsp);
          }
        } else {
          handleAPIError(rsp);
        }
        setIsLoadingUpdatePassword(false);
      }
    }
  }

  const onToggleMenu = (e) => {
    $('#setting-menu').toggleClass("invisible");
    $('#setting-menu').toggleClass("visible");
  }

  const disableTwoFA = async () => {

    setIsLoadingDisableFA(true);

    const response = await fetch(apiURL + 'api/v1/user/change/authentication', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + props.user.authToken
      },
      body: JSON.stringify({
        authentication: 0, // 1 for email authentication
        authentication_type: user?.fa_type,
        // authentication_code: code // pass null for email authentication
      })
    });
    const rsp = await response.json();
    console.log("rsp --------------------------------");
    console.log(response);
    console.log(rsp);
    if (response.status >= 200 && response.status < 300) {
      if (rsp.payload) {
        toast("Two-Factor Authentication is OFF!");
        setUser({ ...user, fa: false });
        getProfile(props.user.authToken);
        setIsLoadingDisableFA(false);
      } else {
        handleAPIError(rsp);
        setIsLoadingDisableFA(false);
      }
    } else {
      if (response.status == 401) {
        dispatch(props.actions.userLogout());
      } else {
        handleAPIError(rsp);
        setIsLoadingDisableFA(false);
      }
    }
  }

  const enableEmailAuth = (e) => {
    askEmailOTPModel.onOpen();
  }

  const enableCodeAuth = (e) => {
    askCodeModel.onOpen();
  }

  const onConfirmCodeClick = async () => {
    setIsLoadingConfirmCode2FA(true);
    const response = await fetch(apiURL + 'api/v1/user/change/authentication', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + props.user.authToken
      },
      body: JSON.stringify({
        authentication: 1, // 1 for enable authentication
        authentication_type: 'code',
        authentication_code: code
      })
    });
    const rsp = await response.json();
    console.log("rsp --------------------------------");
    console.log(response);
    console.log(rsp);
    if (response.status >= 200 && response.status < 300) {
      if (rsp.payload) {
        toast("Secret code authentication is ON!");
        setUser({ ...user, fa: true, fa_type: 'code' });
        getProfile(props.user.authToken);
        setIsLoadingConfirmCode2FA(false);
        askCodeModel.onClose();
      } else {
        handleAPIError(rsp);
        setIsLoadingConfirmCode2FA(false);
      }
    } else {
      if (response.status == 401) {
        dispatch(props.actions.userLogout());
      } else {
        handleAPIError(rsp);
        setIsLoadingConfirmCode2FA(false);
      }
    }
  }

  const onConfirmEmailOTPClick = async () => {
    setIsLoadingConfirmEmail2FA(true);
    const response = await fetch(apiURL + 'api/v1/user/change/authentication', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + props.user.authToken
      },
      body: JSON.stringify({
        authentication: 1, // 1 for enable authentication
        authentication_type: 'email'
      })
    });
    const rsp = await response.json();
    console.log("rsp --------------------------------");
    console.log(response);
    console.log(rsp);
    if (response.status >= 200 && response.status < 300) {
      if (rsp.payload) {
        toast("Email authentication is ON!");
        setUser({ ...user, fa: true, fa_type: 'email' });
        getProfile(props.user.authToken);
        setIsLoadingConfirmEmail2FA(false);
        askEmailOTPModel.onClose();
      } else {
        handleAPIError(rsp);
        setIsLoadingConfirmEmail2FA(false);
      }
    } else {
      if (response.status == 401) {
        dispatch(props.actions.userLogout());
      } else {
        handleAPIError(rsp);
        setIsLoadingConfirmEmail2FA(false);
      }
    }
  }

  const render2FAContent = () => {
    if (user?.fa) {
      if (user?.fa_type == 'email') {
        return (
          <>
            <div className='fa-status-3ndak2'>
              <InfoIcon size={18} />
              <span className='fa-status-text-3ndak2'>Two-factor authentication via email one-time password (OTP) is on.</span>
            </div>

            <div className="info-cards-i73cas">
              <div className="info-card-9cajy6">
                <div style={{ flexDirection: 'row', alignItems: 'center', display: 'flex', marginTop: 10 }}>
                  <LockIcon color="var(--fourth-color)" size={25} />
                  <div style={{ marginLeft: 20, flexDirection: 'column', display: 'flex' }}>
                    <span className="info-value-ma82ba">
                      Email Authorization
                    </span>
                  </div>
                </div>
                {isLoadingDisableFA ?
                  <Spinner size='md' color='primary' style={{ marginRight: 10 }} />
                  :
                  <Switch
                    size="lg"
                    checked={user?.fa}
                    isSelected={user?.fa}
                    onChange={(e) => disableTwoFA()}
                  />
                }
              </div>
            </div>
          </>
        );
      }
      else if (user?.fa_type == 'code') {
        return (
          <>
            <div className='fa-status-3ndak2'>
              <InfoIcon size={18} />
              <span className='fa-status-text-3ndak2'>Two-factor authentication via secret code is on.</span>
            </div>

            <div className="info-cards-i73cas">
              <div className="info-card-9cajy6">
                <div style={{ flexDirection: 'row', alignItems: 'center', display: 'flex', marginTop: 10 }}>
                  <LockIcon color="var(--fourth-color)" size={25} />
                  <div style={{ marginLeft: 20, flexDirection: 'column', display: 'flex' }}>
                    <span className="info-value-ma82ba">
                      Secret Code Authorization
                    </span>
                  </div>
                </div>
                {isLoadingDisableFA ?
                  <Spinner size='md' color='primary' style={{ marginRight: 10 }} />
                  :
                  <Switch
                    size="lg"
                    checked={user?.fa}
                    isSelected={user?.fa}
                    onChange={(e) => disableTwoFA()}
                  />
                }
              </div>
            </div>
          </>
        );
      }
    } else {
      return (
        <>
          <div style={{ borderRadius: 6 }}>
            <div className="info-card-9cajy6" style={{ cursor: 'pointer', }} onClick={enableEmailAuth}>
              <div style={{ flexDirection: 'row', alignItems: 'center', display: 'flex', }}>
                <MailIcon color="var(--fourth-color)" size={22} />
                <div style={{ marginLeft: 20, flexDirection: 'column', display: 'flex' }}>
                  <span className="fa-title-ma82ba" style={{ fontSize: 16 }} >
                    Email Authentication (via OTP)
                  </span>
                  <span className="fa-sub-title-ma82ba">
                    Use your email ({props.user?.user?.email}) to receive security code
                  </span>
                </div>
              </div>
              <div style={{}}>
                <ChevronRightIcon color="var(--fourth-color)" size={23} />
              </div>
            </div>

            <div className="info-card-9cajy6" style={{ cursor: 'pointer', }} onClick={enableCodeAuth}>
              <div style={{ flexDirection: 'row', alignItems: 'center', display: 'flex', }}>
                <BinaryIcon color="var(--fourth-color)" size={24} />
                <div style={{ marginLeft: 20, flexDirection: 'column', display: 'flex' }}>
                  <span className="fa-title-ma82ba" style={{ fontSize: 16 }} >
                    Secret Code Authentication
                  </span>
                  <span className="fa-sub-title-ma82ba">
                    Create a new secret code for authentication
                  </span>
                </div>
              </div>
              <div style={{}}>
                <ChevronRightIcon color="var(--fourth-color)" size={23} />
              </div>
            </div>
          </div>

        </>
      );
    }
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
                src={user?.avatar ? encodeURI(apiURL.slice(0, -1) + user?.avatar) : "/assets/person.png"}
                width={46}
                height={46}
              />
              <div className="user-details-23mas">
                <div style={{ flexDirection: 'row', alignItems: 'center', display: 'flex' }}>
                  <span className="username-312c02qena">{user?.first_name + " " + user?.last_name}</span>
                </div>
                <div style={{ flexDirection: 'row', alignItems: 'center', display: 'flex' }}>
                  {/* <AtSign color="var(--fifth-color)" size={13.5} style={{ marginRight: 2 }} /> */}
                  {/* <InfoIcon color='#c5bfbf' size={14} style={{ marginRight: 4 }} /> */}
                  <span className="tag-kla3mca2">{user?.email}</span>
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
            <p style={{ color: 'var(--fourth-color)', fontSize: 14 }}>Add an extra layer of security by enabling 2FA on your account.</p>

            {render2FAContent()}

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
              <ModalHeader className="modal-title-mcan3 flex flex-col gap-1">Change Username</ModalHeader>
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
                      notSameUsername: "Your existing current username!"
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

                    <Button className='main-button-7ajb312' isLoading={isLoadingUpdateUsername} spinner={<Spinner color='current' size='sm' />} fullWidth radius='sm' size='lg' type='submit' color=''>
                      Update Username
                    </Button>

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
              <ModalHeader className="modal-title-mcan3 flex flex-col gap-1">Change Password</ModalHeader>
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
                      matches: "Confirm Password is not matched!",
                    },
                    password: {
                      required: "Current Password is required!",
                    },
                  }}
                  onSubmit={onChangePasswordClick}
                >
                  <form>
                    <div>
                      <span className='modal-title-mcan3 fs-6'>New password</span>
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
                      <span className='modal-title-mcan3 fs-6'>Confirm your current password</span>
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

                    <Button className='main-button-7ajb312' isLoading={isLoadingUpdatePassword} spinner={<Spinner color='current' size='sm' />} fullWidth radius='sm' size='lg' type='submit' color=''>
                      Update Password
                    </Button>

                  </form>
                </ValidatedForm>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        id="ask-email-otp"
        isOpen={askEmailOTPModel.isOpen}
        backdrop="opaque"
        radius="md"
        onOpenChange={askEmailOTPModel.onOpenChange}
        classNames={{
          body: "py-6 modal-mcan3",
          header: "modal-header-mcan3 border-b-[1px] border-[#292f46]",
          footer: "modal-mcan3",
        }}
        onClose={() => {
          setCode('');
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="modal-title-mcan3 flex flex-col gap-1">Confirm Action</ModalHeader>
              <ModalBody>
                <>
                  <div>
                    <span className='modal-title-mcan3 fs-6'>Are you sure do you want to enable Email Authentication?</span>
                  </div>
                </>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" className='side-button-23nfk3w3Z' style={{ marginLeft: 30 }} radius='sm' size='lg' color='' onClick={onClose}>
                  Cancel
                </Button>
                <Button className='main-button-7ajb312' style={{ width: 'fit-content', marginBottom: 0 }} spinner={<Spinner color='current' size='sm' />} isLoading={isLoadingConfirmEmail2FA} radius='sm' size='lg' type='submit' color='' onPress={onConfirmEmailOTPClick}>
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        id="ask-code"
        isOpen={askCodeModel.isOpen}
        backdrop="opaque"
        radius="md"
        onOpenChange={askCodeModel.onOpenChange}
        classNames={{
          body: "py-6 modal-mcan3",
          header: "modal-header-mcan3 border-b-[1px] border-[#292f46]",
          footer: "modal-mcan3 pt-2",
        }}
        onClose={() => {
          setCode('');
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="modal-title-mcan3 flex flex-col gap-1">Confirm Action</ModalHeader>
              <ModalBody>
                <ValidatedForm
                  rules={{
                    code: {
                      required: true,
                      minLength: 4
                    },
                  }}
                  messages={{
                    code: {
                      required: "Code is required!",
                      minLength: "Minimum 4 digits required!"
                    }
                  }}
                  onSubmit={onConfirmCodeClick}
                >
                  <form>
                    <div>
                      <span className='modal-title-mcan3 fs-6'>Create your secret code</span>
                      <input
                        type="text"
                        name="code"
                        className="form-control-7ajb312"
                        placeholder="Enter the code"
                        autoComplete="off"
                        value={code}
                        maxLength={4}
                        onChange={(event) =>
                          setCode(event.target.value)
                        }
                      />
                    </div>
                  </form>
                </ValidatedForm>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" className='side-button-23nfk3w3Z' style={{ marginLeft: 30 }} radius='sm' size='lg' color='' onClick={onClose}>
                  Cancel
                </Button>
                <Button className='main-button-7ajb312' style={{ width: 'fit-content', marginBottom: 0 }} spinner={<Spinner color='current' size='sm' />} isLoading={isLoadingConfirmCode2FA} radius='sm' size='lg' type='submit' color='' onPress={onConfirmCodeClick}>
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default connect(Account);
