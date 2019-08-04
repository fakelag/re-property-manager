import React, { useEffect, useState } from 'react';
import axios from 'axios';
import IProperty from '../interfaces/Property';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';

const PropertyList = ({ filterByAddress }: { filterByAddress: string }) => {
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

	return (<div className="PropertyList">
		{isLoading
			&& <ProgressSpinner />
			|| <DataTable
				value={properties.filter((prop) =>
					!filterByAddress
					|| prop.address.toUpperCase().indexOf(filterByAddress.toUpperCase()) !== -1)}
			>
				<Column field="address" header="Address" />
				<Column field="city" header="City" />
				<Column field="apartmentType" header="Type" />
			</DataTable>
		}
	</div>);
};

export default PropertyList;
