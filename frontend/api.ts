import axios from 'axios';
import IProperty from './interfaces/Property';
import ILogin from './interfaces/Login';
// import IContract from './interfaces/Contract';

const fetchPropertyList = async (): Promise<IProperty[] | null> => {
	try {
		const response = await axios.get<IProperty[]>('/api/property');

		if (response.status === 200)
			return response.data;
	} catch (err) {
		console.error(err);
	}

	return null;
};

const fetchProperty = async (propertyId: string): Promise<IProperty | null> => {
	try {
		const response = await axios.get<IProperty>(`/api/property/${propertyId}`);

		if (response.status === 200)
			return response.data;
	} catch (err) {
		console.error(err);
	}

	return null;
};

const createProperty = async (property: Omit<IProperty, 'id'>): Promise<IProperty | null> => {
	try {
		const response = await axios.put<IProperty>('/api/property', property);

		if ((response.status === 200 // Ok
			|| response.status === 201) // Created
			&& response.data) {
			return response.data;
		}
	} catch (err) {
		console.error(err);
	}

	return null;
};

const updateProperty = async (propertyId: string, property: Omit<IProperty, 'id'>): Promise<IProperty | null> => {
	try {
		const response = await axios.post<IProperty>('/api/property', { id: propertyId, propertyIn: property });

		if (response.status === 200)
			return response.data;
	} catch (err) {
		console.error(err);
	}

	return null;
};

const deleteProperty = async (propertyId: string): Promise<boolean> => {
	try {
		const response = await axios.delete(`/api/property/${propertyId}`);

		if (response.status === 200)
			return true;
	} catch (err) {
		console.error(err);
	}

	return false;
};

const fetchLogin = async (): Promise<ILogin | null> => {
	try {
		const response = await axios.get<ILogin>('/api/user');

		if (response.status === 200 && response.data)
			return response.data;
	} catch (err) {
		console.error(err);
	}

	return null;
};

const login = async (username: string, password: string): Promise<ILogin | null> => {
	try {
		const response = await axios.post<ILogin>('/api/user/login', { username, password });

		if (response.status === 200 && response.data)
			return response.data;
	} catch (err) {
		console.error(err);
	}

	return null;
};

export const propertyApi = {
	createProperty,
	deleteProperty,
	fetchProperty,
	fetchPropertyList,
	updateProperty,
};

export const userApi = {
	fetchLogin,
	login,
};
