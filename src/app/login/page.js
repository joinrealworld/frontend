"use client";

import { useEffect, useState } from 'react'
import Link from 'next/link';
import { MoveLeft } from 'lucide-react';
import { useDispatch } from 'react-redux';

import './styles.css';
import ValidatedForm from "../../components/ValidatedForm";
import connect from '@/components/ConnectStore/connect';
import BusyLoading from '@/components/BusyLoading';
import { apiURL, handleAPIError } from '@/constant/global';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@nextui-org/react';

function Login(props) {

	const dispatch = useDispatch();
	const router = useRouter();

	const verifyOTPModel = useDisclosure({
		id: 'otp-verify',
	});

	const [emailAddress, setEmailAddress] = useState('');
	const [password, setPassword] = useState("");

	const [otp, setOTP] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const onVerifyOTPClick = async () => {
		try {
			const response = await fetch(apiURL + 'api/v1/user/verify_otp', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					"email": emailAddress,
					"otp": otp
				})
			});
			if (response.status >= 200 && response.status < 300) {
				verifyOTPModel.onClose();
				const rsp = await response.json();
				if (rsp.payload?.user && rsp.payload?.user?.id) {
					dispatch(props.actions.userLogin({
						user: rsp.payload?.user,
						authToken: rsp.payload?.token?.access,
						refreshToken: rsp.payload?.token?.refresh
					}));
					router.replace('/');
				} else {
					toast("Something went wrong!");
				}
			} else {
				verifyOTPModel.onClose();
				toast("Something went wrong!");
			}
		} catch (error) {
			verifyOTPModel.onClose();
			toast("Something went wrong!");
		}
	};

	const onLoginClick = async () => {
		try {
			setIsLoading(true);
			const response = await fetch(apiURL + 'api/v1/user/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					"email": emailAddress,
					"password": password
				})
			});
			if (response.status >= 200 && response.status < 300) {
				const rsp = await response.json();
				console.log("rsp: ", rsp);
				// zzz - check OTP verification or not

				if (rsp.payload?.user && rsp.payload?.user?.id) {
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
				const rsp = await response.json();
				handleAPIError(rsp);
				setIsLoading(false);
			}
		} catch (error) {
			toast("Something went wrong!");
			setIsLoading(false);
		}
	};

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

							<button className="main-button-mc2342" type="submit">Log In</button>

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
								Verify OTP
							</ModalHeader>
							<ModalBody>
								<span className="text-white" style={{ fontSize: 14, marginBottom: -10 }}>OTP sent to your email. Enter OTP below</span>
								<ValidatedForm
									rules={{
										otp: {
											required: true,
											minLength: 6,
										},
									}}
									messages={{
										otp: {
											required: "Enter the OTP",
											minLength: "Invalid OTP!",
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
												placeholder="One Time Password (OTP)"
												autoComplete="off"
												maxLength={6}
												pattern="/^[0-9]+$/"
												value={otp}
												onChange={(event) =>
													setOTP(event.target.value)
												}
											/>
										</div>

										<button type="submit" className="main-button-mc2342" style={{ marginBottom: 22 }}>
											Verify
										</button>
									</form>
								</ValidatedForm>
							</ModalBody>
						</>
					)}
				</ModalContent>
			</Modal>

			<BusyLoading isLoading={isLoading} />
		</div>
	);
}

export default connect(Login);
