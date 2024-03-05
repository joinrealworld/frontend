"use client";

import { useEffect, useState } from 'react'
import Link from 'next/link';
import { MoveLeft } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, useDisclosure } from '@nextui-org/react';

import './styles.css';
import ValidatedForm from "@/components/ValidatedForm";
import connect from '@/components/ConnectStore/connect';
import { apiURL, handleAPIError } from '@/constant/global';
import { lightTheme } from '@/themes/lightTheme';
import { darkTheme } from '@/themes/darkTheme';

function Login(props) {

	const dispatch = useDispatch();
	const router = useRouter();

	const verifyOTPModel = useDisclosure({
		id: 'otp-verify',
	});

	const sendVerificationMailModel = useDisclosure({
		id: 'send-verification-mail',
	});

	const [emailAddress, setEmailAddress] = useState('');
	const [password, setPassword] = useState("");

	const [otp, setOTP] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingEmailVerification, setIsLoadingEmailVerification] = useState(false);

	const onVerifyOTPClick = async () => {
		let data = {
			"email": emailAddress,
			"password": password,
			"fa_code": otp
		};
		onLoginProcess(data);
	};

	const onLoginClick = () => {
		let data = {
			"email": emailAddress,
			"password": password
		};
		onLoginProcess(data);
	};

	const onLoginProcess = async (data) => {
		try {
			setIsLoading(true);
			const response = await fetch(apiURL + 'api/v1/user/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});
			const rsp = await response.json();
			console.log("data: ", data);
			console.log("rsp: ", rsp);
			if (response.status >= 200 && response.status < 300) {
				if (rsp.payload?.user && rsp.payload?.user?.id) {
					if (rsp.payload?.user?.theme == 'dark') {
						darkTheme();
						localStorage.setItem("theme", JSON.stringify('dark'));
					}
					else if (rsp.payload?.user?.theme == 'light') {
						lightTheme();
						localStorage.setItem("theme", JSON.stringify('light'));
					}
					dispatch(props.actions.userLogin({
						user: rsp.payload?.user,
						authToken: rsp.payload?.token?.access,
						refreshToken: rsp.payload?.token?.refresh
					}));
					router.replace('/');
				} else {
					handleAPIError(rsp);
					setIsLoading(false);
				}
			} else {
				if (response.status == 422 && (rsp.payload + "").includes("Please Enter 2FA verification Code.")) {
					verifyOTPModel.onOpen();
				} else {
					if (rsp.status == -1 && (rsp.payload + "").includes("Please Verify Your Email.")) {
						sendVerificationMailModel.onOpen();
					} else {
						handleAPIError(rsp);
					}
				}
				if (data.fa_code) {
					setOTP('');
				}
				setIsLoading(false);
			}
		} catch (error) {
			toast("Something went wrong!");
			setIsLoading(false);
		}
	}

	const onSendEmailVerification = async () => {
		try {
			setIsLoadingEmailVerification(true);
			const response = await fetch(apiURL + 'api/v1/user/resend_mail?email=' + emailAddress, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			const rsp = await response.json();
			if (response.status >= 200 && response.status < 300) {
				console.log("rsp: ", rsp);
				if (rsp.payload && rsp.payload) {
					setIsLoadingEmailVerification(false);
					toast("Verification mail sent to your email address! Check your email.");
					sendVerificationMailModel.onClose();
				} else {
					handleAPIError(rsp);
					setIsLoadingEmailVerification(false);
				}
			} else {
				handleAPIError(rsp);
				setIsLoadingEmailVerification(false);
			}
		} catch (error) {
			toast("Something went wrong!");
			setIsLoadingEmailVerification(false);
		}
	}

	useEffect(() => {
		if (props.user.isLoggedIn) {
			router.push('/');
		}
	}, []);


	return (
		<div className="main-body-lan229 absolute inset-0 flex row justify-content-lg-center justify-content-md-center">
			<div className="login-page-mcaiwd">
				<div className="form-mc72bk">
					<ValidatedForm
						rules={{
							emailAddress: {
								required: true,
								email: true,
							},
							password: {
								required: true,
							},
						}}
						messages={{
							emailAddress: {
								required: "Email address is required!",
								email: "Invalid Email address",
							},
							password: {
								required: "Password is required!",
								password: "Invalid Password"
							},
						}}
						onSubmit={onLoginClick}
					>
						<form>
							<h3 className='form-title-sm2fca'>Sign in to your account</h3>
							<div>
								<input
									type="text"
									name="emailAddress"
									className="form-control-q3csd"
									placeholder="Email Address"
									value={emailAddress}
									id="email"
									autoComplete="off"
									onChange={(event) =>
										setEmailAddress(event.target.value)
									}
								/>
							</div>

							<div>
								<input
									type="password"
									name="password"
									className="form-control-q3csd"
									placeholder="Password"
									autoComplete="off"
									id="pass"
									value={password}
									onChange={(event) =>
										setPassword(event.target.value)
									}
								/>
							</div>

							<Link href="/forget-password">
								<p className="fp-link-23mcma">Forgot your password?</p>
							</Link>

							<Button className="main-button-mc2342" isLoading={isLoading} fullWidth radius='sm' size='lg' type='submit' color='' spinner={<Spinner color='current' size='sm' />}>
								Log In
							</Button>

							<div className='back-action-ms32sa'>
								<MoveLeft color="#b78727" size={23} style={{ marginBottom: 3.5 }} />
								<Link href="/">
									<span className="back-jak29a">Go Back</span>
								</Link>
							</div>
						</form>
					</ValidatedForm>
				</div>
			</div>
			<Modal
				id="send-verification-mail"
				isOpen={sendVerificationMailModel.isOpen}
				backdrop="opaque"
				radius="md"
				onOpenChange={sendVerificationMailModel.onOpenChange}
				classNames={{
					body: "py-6 modal-mcan3w",
					header: "modal-header-mcan3w border-b-[1px] border-[#292f46]",
					footer: "modal-mcan3w",
				}}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="modal-title-2nda2 flex flex-col gap-1">
								Email Verification Pending!
							</ModalHeader>
							<ModalBody>
								<div>
									<span className='modal-title-2nda2 fs-6'>Please verify your email to login.</span>
								</div>
							</ModalBody>
							<ModalFooter>
								<Button variant="light" className='side-button-mc2342' style={{ marginLeft: 30 }} radius='sm' size='lg' color='' onClick={onClose}>
									Cancel
								</Button>
								<Button className='main-button-mc2342' style={{ width: 'fit-content', marginBottom: 0 }} spinner={<Spinner color='current' size='sm' />} isLoading={isLoadingEmailVerification} radius='sm' size='lg' type='submit' color='' onPress={onSendEmailVerification}>
									Send Verification Email
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
			<Modal
				id="otp-verify"
				isOpen={verifyOTPModel.isOpen}
				backdrop="opaque"
				radius="md"
				onOpenChange={verifyOTPModel.onOpenChange}
				classNames={{
					body: "py-6 modal-mcan3w",
					header: "modal-header-mcan3w border-b-[1px] border-[#292f46]",
				}}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1 text-white">
								Verify Code
							</ModalHeader>
							<ModalBody>
								<span className="text-white" style={{ fontSize: 14, marginBottom: -10 }}>Code sent to your email. Enter the Code below</span>
								<ValidatedForm
									rules={{
										otp: {
											required: true,
											minLength: 4,
										},
									}}
									messages={{
										otp: {
											required: "Enter the Code",
											minLength: "Invalid Code!",
										},
									}}
									onSubmit={onVerifyOTPClick}
								>
									<form>
										<div>
											<input
												type="text"
												name="otp"
												className="form-control-23ad24"
												placeholder="Enter the Code"
												autoComplete="off"
												maxLength={4}
												value={otp}
												onChange={(event) =>
													setOTP(event.target.value)
												}
											/>
										</div>

										<Button className="main-button-mc2342" style={{ marginBottom: 22 }} isLoading={isLoading} spinner={<Spinner color='current' size='sm' />} fullWidth radius='sm' size='lg' type='submit' color=''>
											Verify
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

export default connect(Login);
