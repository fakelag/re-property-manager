import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Growl } from 'primereact/growl';
import { setGrowl } from '../store';
import { userApi } from '../api';
import App from './App';
import Login from './Login';

import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primeicons/primeicons.css';

const Root = () => {
	const [loginData, setLoginData] = useState({ id: '' });
	const [hasFetchedLogin, setHasFetchedLogin] = useState(false);

	const dispatch = useDispatch();

	if (!hasFetchedLogin) {
		userApi.fetchLogin()
			.then((fetchData) => fetchData && setLoginData(fetchData))
			.finally(() => setHasFetchedLogin(true));
	}

	const sendLogin = async (username: string, password: string) => {
		userApi.login(username, password)
			.then((fetchData) => fetchData && setLoginData(fetchData));
	};

	return (<>
		{loginData.id && <App /> || <Login sendLogin={sendLogin} />}
		<Growl id="main-growl" ref={(el) => dispatch(setGrowl(el))} />
	</>);
};

export default Root;
