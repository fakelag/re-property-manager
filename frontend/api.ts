import axios from 'axios';
import IProperty from './interfaces/Property';
import ILogin from './interfaces/Login';
import IInvoice from './interfaces/Invoice';
import IContract from './interfaces/Contract';
import ITransaction from './interfaces/Transaction';

const fetchPropertyList = async (): Promise<IProperty[]> => {
	try {
		const response = await axios.get<IProperty[]>('/api/property');

		if (response.status !== 200)
			throw new Error(`Invalid status code: , ${response.status}`);

		return response.data;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

const fetchProperty = async (propertyId: string): Promise<IProperty> => {
	try {
		const response = await axios.get<IProperty>(`/api/property/${propertyId}`);

		if (response.status !== 200)
			throw new Error(`Invalid status code: , ${response.status}`);

		return response.data;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

const createProperty = async (property: Omit<IProperty, 'id'>): Promise<IProperty> => {
	try {
		const response = await axios.put<IProperty>('/api/property', property);

		if (response.status === 200 || response.status === 201) // Ok | Created
			return response.data;

		throw new Error(`Invalid status code: , ${response.status}`);
	} catch (err) {
		console.error(err);
		throw err;
	}
};

const updateProperty = async (propertyId: string, property: Omit<IProperty, 'id'>): Promise<IProperty> => {
	try {
		const response = await axios.post<IProperty>('/api/property', { id: propertyId, propertyIn: property });

		if (response.status !== 200)
			throw new Error(`Invalid status code: , ${response.status}`);

		return response.data;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

const deleteProperty = async (propertyId: string): Promise<void> => {
	try {
		const response = await axios.delete(`/api/property/${propertyId}`);

		if (response.status !== 200)
			throw new Error(`Invalid status code: , ${response.status}`);
	} catch (err) {
		console.error(err);
		throw err;
	}
};

const fetchContract = async (contractId: string): Promise<IContract> => {
	try {
		const response = await axios.get<IContract>(`/api/contract/${contractId}`);

		if (response.status !== 200)
			throw new Error(`Invalid status code: , ${response.status}`);

		return response.data;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

const createContract = async (propertyId: string, contract: IContract): Promise<IContract> => {
	try {
		const response = await axios.put<IContract>('/api/contract', { propertyId, contract });

		if (response.status === 200 || response.status === 201) // Ok | Created
			return response.data;

		throw new Error(`Invalid status code: , ${response.status}`);
	} catch (err) {
		console.error(err);
		throw err;
	}
};

const updateContract = async (propertyId: string, contractId: string, contract: IContract): Promise<IContract> => {
	try {
		const response = await axios.post<IContract>('/api/contract', { propertyId, contractId, contract });

		if (response.status === 200)
			return response.data;

		throw new Error(`Invalid status code: , ${response.status}`);
	} catch (err) {
		console.error(err);
		throw err;
	}
};

const deleteContract = async (propertyId: string, contractId: string): Promise<void> => {
	try {
		const response = await axios.delete('/api/contract', { data: { propertyId, contractId } });

		if (response.status !== 200)
			throw new Error(`Invalid status code: , ${response.status}`);
	} catch (err) {
		console.error(err);
		throw err;
	}
};

const fetchInvoiceListForContract = async (contractId: string): Promise<IInvoice[]> => {
	try {
		const response = await axios.get<IInvoice[]>(`/api/invoice/forcontract?contractId=${contractId}`);

		if (response.status !== 200)
			throw new Error(`Invalid status code: , ${response.status}`);

		return response.data;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

const fetchInvoice = async (invoiceId: string): Promise<IInvoice> => {
	try {
		const response = await axios.get<IInvoice>(`/api/invoice/${invoiceId}`);

		if (response.status !== 200)
			throw new Error(`Invalid status code: , ${response.status}`);

		return response.data;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

const createInvoice = async (invoice: IInvoice): Promise<IInvoice> => {
	try {
		const response = await axios.put<IInvoice>('/api/invoice', {
			amount: invoice.amount,
			description: invoice.description,
			dueDate: invoice.dueDate,
			linkedContract: invoice.linkedContract,
		});

		if (response.status === 200 || response.status === 201) // Ok | Created
			return response.data;

		throw new Error(`Invalid status code: , ${response.status}`);
	} catch (err) {
		console.error(err);
		throw err;
	}
};

const deleteInvoice = async (invoiceId: string): Promise<void> => {
	try {
		const response = await axios.delete(`/api/invoice/${invoiceId}`);

		if (response.status !== 200)
			throw new Error(`Invalid status code: , ${response.status}`);
	} catch (err) {
		console.error(err);
		throw err;
	}
};

const updateInvoice = async (invoiceId: string, invoice: IInvoice): Promise<IInvoice> => {
	try {
		const response = await axios.post<IInvoice>('/api/invoice', {
			amount: invoice.amount,
			description: invoice.description,
			dueDate: invoice.dueDate,
			invoiceId,
			linkedContract: invoice.linkedContract,
		});

		if (response.status === 200)
			return response.data;

		throw new Error(`Invalid status code: , ${response.status}`);
	} catch (err) {
		console.error(err);
		throw err;
	}
};

const fetchTransactionList = async (): Promise<ITransaction[]> => {
	try {
		const response = await axios.get<ITransaction[]>('/api/transaction');

		if (response.status !== 200)
			throw new Error(`Invalid status code: , ${response.status}`);

		return response.data;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

const fetchTransaction = async (transactionId: string): Promise<ITransaction> => {
	try {
		const response = await axios.get<ITransaction>(`/api/transaction/${transactionId}`);

		if (response.status !== 200)
			throw new Error(`Invalid status code: , ${response.status}`);

		return response.data;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

const createTransaction = async (transaction: ITransaction): Promise<ITransaction> => {
	try {
		const response = await axios.put<ITransaction>('/api/transaction', transaction);

		if (response.status !== 200 && response.status !== 201)
			throw new Error(`Invalid status code: , ${response.status}`);

		return response.data;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

const createTransactionList = async (transactionList: ITransaction[]): Promise<ITransaction[]> => {
	try {
		const response = await axios.put<ITransaction[]>('/api/transaction/many', transactionList);

		if (response.status !== 200 && response.status !== 201)
			throw new Error(`Invalid status code: , ${response.status}`);

		return response.data;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

const updateTransaction = async (transactionId: string, transaction: ITransaction): Promise<ITransaction> => {
	try {
		const response = await axios.post<ITransaction>('/api/transaction',
			{ id: transactionId, transactionIn: transaction });

		if (response.status !== 200)
			throw new Error(`Invalid status code: , ${response.status}`);

		return response.data;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

const deleteTransaction = async (transactionId: string): Promise<void> => {
	try {
		const response = await axios.delete(`/api/transaction/${transactionId}`);

		if (response.status !== 200)
			throw new Error(`Invalid status code: , ${response.status}`);
	} catch (err) {
		console.error(err);
		throw err;
	}
};

const fetchLogin = async (): Promise<ILogin> => {
	try {
		const response = await axios.get<ILogin>('/api/user');

		if (response.status !== 200)
			throw new Error(`Invalid status code: , ${response.status}`);

		return response.data;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

const login = async (username: string, password: string): Promise<ILogin> => {
	try {
		const response = await axios.post<ILogin>('/api/user/login', { username, password });

		if (response.status !== 200)
			throw new Error(`Invalid status code: , ${response.status}`);

		return response.data;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

export const propertyApi = {
	createProperty,
	deleteProperty,
	fetchProperty,
	fetchPropertyList,
	updateProperty,
};

export const contractApi = {
	createContract,
	deleteContract,
	fetchContract,
	updateContract,
};

export const invoiceApi = {
	createInvoice,
	deleteInvoice,
	fetchInvoice,
	fetchInvoiceListForContract,
	updateInvoice,
};

export const transactionApi = {
	createTransaction,
	createTransactionList,
	deleteTransaction,
	fetchTransaction,
	fetchTransactionList,
	updateTransaction,
};

export const userApi = {
	fetchLogin,
	login,
};
