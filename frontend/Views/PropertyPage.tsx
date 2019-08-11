import React, { useEffect, useState } from 'react';
import router from '../router';
import IProperty from '../interfaces/Property';
import { propertyApi } from '../api';
import { match as MatchParams } from 'react-router';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import IContract from '../interfaces/Contract';

const PropertyPage = ({ match }: { match: MatchParams<{ propertyId: string }> }) => {
	const [deleteDialog, setDeleteDialog] = useState(false);
	const [isError, setIsError] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [property, setProperty] = useState<IProperty | null>(null);

	useEffect(() => {
		propertyApi.fetchProperty(match.params.propertyId)
			.then((data) => setProperty(data))
			.catch(() => setIsError(true))
			.finally(() => setIsLoading(false));
	}, []);

	const deleteProperty = () => {
		propertyApi.deleteProperty(match.params.propertyId)
			.then(() => router.push('/'))
			.catch(() => setIsError(true));
	};

	if (isError)
		return (<>Network Error</>);

	return (<div className="PropertyPage">
		{isLoading ? <ProgressSpinner /> :
			property ? <>
				<section>
					<DataTable
						value={property.contracts}
						selectionMode="single"
						onRowSelect={(e: { originalEvent: Event; data: IContract; type: string; }) =>
							router.push(`/contract/${property.id}/${e.data.id}`)}
					>
						<Column field="id" header="Id" />
						<Column field="participant.fullName" header="Participant Name" />
						<Column field="participant.email" header="Participant Email" />
					</DataTable>
					<Dialog
						header="Delete the property"
						visible={deleteDialog}
						style={{ width: '20rem' }}
						footer={<>
							<Button label="Delete" icon="pi pi-check" onClick={deleteProperty}
								className="p-button-danger"/>
							<Button label="Cancel" icon="pi pi-times" onClick={() => setDeleteDialog(false)}
								className="p-button-secondary" />
						</>}
						onHide={() => setDeleteDialog(false)}
						maximizable
					>
						Do you want to delete this property permanently?
					</Dialog>
				</section>
				<section>
					<Button
						className="p-button-info"
						label="Add Contract"
						iconPos="left"
						onClick={() => router.push(`/contractsettings/${property.id}`)}
					/>
					<Button
						className="p-button-danger"
						label="Delete property"
						icon="pi pi-trash"
						iconPos="left"
						onClick={() => setDeleteDialog(true)}
					/>
				</section>
			</> : <>404 Not Found</>
		}
	</div>);
};

export default PropertyPage;
