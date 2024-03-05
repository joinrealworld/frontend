"use client";
import React, { useEffect, useState } from "react";
import { Check, MenuIcon } from "lucide-react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import $ from 'jquery';

import "./../styles.css";
import SettingsMenu from "@/components/SettingsMenu";
import { darkTheme } from "@/themes/darkTheme";
import { lightTheme } from "@/themes/lightTheme";
import { apiURL, handleAPIError } from "@/constant/global";
import connect from '@/components/ConnectStore/connect';

function Preferences(props) {

	const dispatch = useDispatch();
	const router = useRouter();

	const [activeDark, setActiveDark] = useState();
	const [mountTheme, setMountTheme] = useState(
		JSON.parse(localStorage.getItem("theme")) || "dark"
	);
	const [activeLight, setActiveLight] = useState();
	const [darkCheck, setDarkCheck] = useState(true);
	const [lightCheck, setLightCheck] = useState(false);
	const brdrStyleDark = {
		border: "3px solid var(--secondary-color)",
		backgroundColor: "#1E2124",
	};
	const brdrStyleLight = {
		border: "3px solid var(--secondary-color)",
		backgroundColor: "#1E2124",
	};

	useEffect(() => {
		if (!props.user.isLoggedIn) {
			router.push('/login');
		} else {
			if (mountTheme === "dark") {
				setActiveDark(brdrStyleDark);
			} else {
				setActiveLight(brdrStyleLight);
				setLightCheck(true);
			}
		}
	}, []);
	useEffect(() => {
		// setActiveDark(brdrStyleDark);
		localStorage.setItem("theme", JSON.stringify(mountTheme));
	}, [mountTheme]);

	const darkThemeButton = () => {
		setMountTheme("dark");
		setActiveDark(brdrStyleDark);
		setActiveLight(null);
		setDarkCheck(true);
		setLightCheck(false);
		darkTheme();

		changeTheme(props.user.authToken, 'dark');
	};
	const lightThemeButton = () => {
		setMountTheme("light");
		setActiveDark(null);
		setActiveLight(brdrStyleLight);
		setDarkCheck(false);
		setLightCheck(true);
		lightTheme();

		changeTheme(props.user.authToken, 'light');
	};

	const changeTheme = async (authToken, theme) => {
		const response = await fetch(apiURL + 'api/v1/user/theme', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + authToken
			},
			body: JSON.stringify({
				theme: theme
			})
		});
		const rsp = await response.json();
		console.log("rsp --------------------------------");
		console.log(response);
		console.log(rsp);
		if (response.status >= 200 && response.status < 300) {
			if (rsp.payload) {
				toast("Theme changed successfully!");
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
					<h4 style={{ color: "var(--fourth-color)" }}>Preferences</h4>
					<p className="pt-5 pb-2" style={{ color: "var(--fourth-color)" }}>
						Theme
					</p>
					<div className="flex gap-4">
						<div className="flex flex-col justify-center relative">
							<div
								className="w-14 h-14 rounded-full bg-black cursor-pointer"
								style={activeDark}
								onClick={darkThemeButton}
							>
								{darkCheck && mountTheme === "dark" && (
									<span
										className="absolute text-white text-center flex justify-center top-0 w-8 rounded-full"
										style={{ backgroundColor: "var(--secondary-color)" }}
									>
										<Check size={20} color="white" className="font-extrabold" />
									</span>
								)}
							</div>

							<span
								style={{ color: "var(--fourth-color)" }}
								className="text-center pt-2"
							>
								Dark
							</span>
						</div>
						<div className="flex flex-col justify-center relative">
							<div
								className="w-14 h-14 rounded-full bg-white cursor-pointer"
								style={activeLight}
								onClick={lightThemeButton}
							></div>
							{console.log(mountTheme)}
							{lightCheck && mountTheme === "light" && (
								<span
									className="absolute text-white text-center flex justify-center top-0 w-8 rounded-full"
									style={{ backgroundColor: "var(--secondary-color)" }}
								>
									<Check size={20} color="white" className="font-extrabold" />
								</span>
							)}
							<span
								style={{ color: "var(--fourth-color)" }}
								className="text-center pt-2"
							>
								Light
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default connect(Preferences);
