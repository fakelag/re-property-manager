import React, { useState } from 'react';
import axios from 'axios';
import App from './App';
import Login from './Login';

import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primeicons/primeicons.css';

const Root = () => {
	const [loginData, setLoginData] = useState({ id: '' });
	const [hasFetchedLogin, setHasFetchedLogin] = useState(false);

	if (!hasFetchedLogin) {
		(async function () {
			try {
				const response = await axios.get<{
					id: string;
					username: string;
				}>('/api/user');

				if (response.status === 200 && response.data)
					setLoginData(response.data);
			} catch (err) {
				console.error('Prelogin connection error: ', err);
			} finally {
				setHasFetchedLogin(true);
			}
		})();
	}

	const sendLogin = async (username: string, password: string) => {
		try {
			const response = await axios.post<{
				id: string;
				username: string;
			}>('/api/user/login', { username, password });

			if (response.status === 200 && response.data)
				setLoginData(response.data);
		} catch (err) {
			console.error('Login connection error: ', err);
		}
	};

	return (<>
		{loginData.id && <App /> || <Login sendLogin={sendLogin} />}
	</>);
};

export default Root;