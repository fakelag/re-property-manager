export default interface ITransaction {
	id: string;
	owner: string;
	amount: number;
	date: Date;
	currency: string;
	description: string;
	parts: Array<{
		invoice: string;
		amount: string;
	}>;
}
