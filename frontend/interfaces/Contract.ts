export default interface IContract {
	id: string;
	property: string;
	participant: {
		id: string;
		fullName: string;
		email: string;
		phone: string;
	};
	beginDate: Date;
	endDate?: Date;
	paymentAmount: number;
	paymentDateOfMonth: number;
	paymentRaise?: {
		costIndexDate: Date;
	};
	securityDeposit?: {
		depositAmount: Date;
		depositDate: Date;
	};
	additionalConditions: string;
	additionalEquipment: string;
	signDate?: Date;
}
