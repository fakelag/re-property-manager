import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IProperty from '../interfaces/Property';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';

const App = () => {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [properties, setProperties] = useState<IProperty[]>([]);

	useEffect(() => {
		const fetchProperties = async () => {
			try {
				const response = await axios.get<IProperty[]>('/api/property');

				if (response.status === 200 && response.data)
					setProperties(response.data);
			} catch (err) {
				console.error('Login connection error: ', err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchProperties();
	}, []);

	return (<>
		{isLoading
			&& <ProgressSpinner />
			|| <DataTable
				value={properties}
			>
				<Column field="address" header="Address" />
				<Column field="city" header="City" />
				<Column field="apartmentType" header="Type" />
			</DataTable>
		}
		<Button label="Log Out" icon="pi pi-sign-out" onClick={(e) => window.location.href = "/api/user/logout"} />
	</>);
};

export default App;
