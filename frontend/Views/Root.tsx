import React, { useState } from 'react';
import { userApi } from '../api';
import App from './App';
import Login from './Login';

import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primeicons/primeicons.css';

const Root = () => {
	const [loginData, setLoginData] = useState({ id: '' });
	const [hasFetchedLogin, setHasFetchedLogin] = useState(false);

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
	</>);
};

export default Root;
