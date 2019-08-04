import React from 'react';
import IProperty from '../interfaces/Property';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const PropertyPage = ({ property }: { property: IProperty }) => {
	return (<div className="PropertyPage">
		<DataTable
			value={property.contracts}
			selectionMode="single"
			onRowSelect={(e: { originalEvent: Event; data: any; type: string; }) =>
				console.log('selected contract: ', e.data)}
		>
			<Column field="id" header="Id" />
		</DataTable>
	</div>);
};

export default PropertyPage;
