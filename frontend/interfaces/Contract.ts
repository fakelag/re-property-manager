export default interface IContract {
	id: string;
	property: string;
	participant: {
		address: string;
		fullName: string;
		email: string;
		phone: string;
		ssn: string;
	};
	beginDate: Date;
	endDate: Date | null;
	paymentAmount: number;
	paymentDayOfMonth: number;
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
