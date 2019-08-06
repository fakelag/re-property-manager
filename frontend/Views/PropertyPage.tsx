import React, { useEffect, useState } from 'react';
import axios from 'axios';
import router from '../router';
import IProperty from '../interfaces/Property';
import { match as MatchParams } from 'react-router';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';

const PropertyPage = ({ match }: { match: MatchParams<{ propertyId: string }> }) => {
	const [deleteDialog, setDeleteDialog] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [property, setProperty] = useState<IProperty | null>(null);

	useEffect(() => {
		(async () => {
			try {
				const response = await axios.get<IProperty>(`/api/property/${match.params.propertyId}`);

				if (response.status === 200 && response.data)
					setProperty(response.data);
			} catch (err) {
				console.error(err);
			} finally {
				setIsLoading(false);
			}
		})();
	}, []);

	const deleteProperty = async () => {
		try {
			const response = await axios.delete(`/api/property/${match.params.propertyId}`);

			if (response.status === 200) {
				setDeleteDialog(false);
				router.push('/');
			}
		} catch (err) {
			console.error(err);
		}
	};

	return (<div className="PropertyPage">
		{isLoading ? <ProgressSpinner /> :
			property ? <>
				<DataTable
					value={property.contracts}
					selectionMode="single"
					onRowSelect={(e: { originalEvent: Event; data: any; type: string; }) =>
						console.log('selected contract: ', e.data)}
				>
					<Column field="id" header="Id" />
					<Column field="participant.fullName" header="Participant Name" />
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
				<Button
					className="p-button-danger"
					label="Delete property"
					icon="pi pi-trash"
					iconPos="left"
					onClick={() => setDeleteDialog(true)}
				/>
			</> : <>404 Not Found</>
		}
	</div>);
};

export default PropertyPage;
