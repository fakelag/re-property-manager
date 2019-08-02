import React from 'react';

const Login = ({ sendLogin }: { sendLogin(username: string, password: string ): Promise<void> }) => {
	let username = '';
	let password = '';

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.stopPropagation();
		event.preventDefault();
		sendLogin(username, password);
	};

	return (<>
		<form onSubmit={handleSubmit}>
			<input type="text" onChange={(event) => username = event.target.value} />
			<input type="password" onChange={(event) => password = event.target.value} />
			<button type="submit">Log In</button>
		</form>
	</>);
};

export default Login;
