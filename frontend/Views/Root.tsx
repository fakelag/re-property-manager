import React, { useState } from 'react';
import axios from 'axios';
import App from './App';
import Login from './Login';

const Root = () => {
	const [loginData, setLoginData] = useState({ id: '' });

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
