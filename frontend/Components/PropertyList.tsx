import React, { useEffect, useState } from 'react';
import { propertyApi } from '../api';
import history from '../router';
import IProperty from '../interfaces/Property';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';

const PropertyList = ({ filterByAddress }: { filterByAddress: string }) => {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isError, setIsError] = useState<boolean>(false);
	const [properties, setProperties] = useState<IProperty[]>([]);

	useEffect(() => {
		propertyApi.fetchPropertyList()
			.then((propertyList) => setProperties(propertyList))
			.catch(() => setIsError(true))
			.finally(() => setIsLoading(false));
	}, []);

	return (<div className="PropertyList">
		{isLoading
			&& <ProgressSpinner />
			|| <DataTable
				paginator
				rows={10}
				value={isError
					? [{ address: 'Network error' }]
					: properties.filter((prop) =>
						!filterByAddress
						|| prop.address.toUpperCase().indexOf(filterByAddress.toUpperCase()) !== -1)}
				selectionMode="single"
				onRowSelect={(e: { data: { id: string } }) => history.push(`/property/${e.data.id}`)}
			>
				<Column field="address" header="Address" />
				<Column field="city" header="City" />
				<Column field="apartmentType" header="Type" />
			</DataTable>
		}
	</div>);
};

export default PropertyList;
