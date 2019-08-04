import React from 'react';
import { match as MatchParams } from 'react-router';
// import IProperty from '../interfaces/Property';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const PropertyPage = ({ match }: { match: MatchParams<{ propertyId: string }> }) => {
	console.log(match.params.propertyId);
	return (<div className="PropertyPage">
		<DataTable
			value={[]}
			selectionMode="single"
			onRowSelect={(e: { originalEvent: Event; data: any; type: string; }) =>
				console.log('selected contract: ', e.data)}
		>
			<Column field="id" header="Id" />
		</DataTable>
	</div>);
};

export default PropertyPage;
