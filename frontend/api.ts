import axios from 'axios';
import IProperty from './interfaces/Property';
import ILogin from './interfaces/Login';
import IContract from './interfaces/Contract';

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

	return false;
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

	return null;
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
	addContract,
}

export const userApi = {
	fetchLogin,
	login,
};
