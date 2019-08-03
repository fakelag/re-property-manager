export default interface IContract {
	id: string;
	property: string;
	participant: {
		id: string;
		fullName: string;
		email: string;
		phone: string;
	};
};
