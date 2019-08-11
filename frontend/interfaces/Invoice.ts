export default interface IInvoice {
	id: string;
	owner: string;
	amount: number;
	amountPaid: number;
	currency: string;
	description: string;
	creationDate: Date;
	dueDate: Date;
	linkedContract: string | null;
}
