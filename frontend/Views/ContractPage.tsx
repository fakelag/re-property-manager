import React, { useEffect, useState } from 'react';
import router from '../router';
import IContract from '../interfaces/Contract';
import IInvoice from '../interfaces/Invoice';
import { contractApi, invoiceApi } from '../api';
import { match as MatchParams } from 'react-router';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';

const ContractPage = ({ match }: { match: MatchParams<{ propertyId: string, contractId: string }> }) => {
	const [deleteDialog, setDeleteDialog] = useState(false);
	const [isError, setIsError] = useState(false);
	const [isLoadingContract, setIsLoadingContract] = useState(true);
	const [isLoadingInvoices, setIsLoadingInvoices] = useState(true);
	const [contract, setContract] = useState<IContract | null>(null);
	const [invoiceList, setInvoiceList] = useState<IInvoice[]>([]);

	useEffect(() => {
		contractApi.fetchContract(match.params.contractId)
			.then((data) => {
				setContract(data);
				invoiceApi.fetchInvoiceListForContract(match.params.contractId)
					.then((invList) => setInvoiceList(invList))
					.catch(() => setIsError(true))
					.finally(() => setIsLoadingInvoices(false));
			})
			.catch(() => setIsError(true))
			.finally(() => setIsLoadingContract(false));
	}, []);

	const deleteContract = () => {
		contractApi.deleteContract(match.params.propertyId, match.params.contractId)
			.then(() => router.push(`/property/${match.params.propertyId}`))
			.catch(() => setIsError(true));
	};

	if (isError)
		return (<>Network Error</>);

	return (<div className="PropertyPage">
		{isLoadingContract ? <ProgressSpinner /> :
			contract ? <>
				<section>
					{isLoadingInvoices
						? <ProgressSpinner />
						: <DataTable
							value={invoiceList.map((inv) => ({
								...inv,
								amount: <p>{inv.amount / 100} &euro;</p>,
								amountPaid: <p>{inv.amountPaid / 100} &euro;</p>,
							}))}
							selectionMode="single"
							// onRowSelect={(e: { originalEvent: Event; data: IContract; type: string; }) =>
							// 	router.push(`/contract/${property.id}/${e.data.id}`)}
						>
							<Column field="id" header="Invoice Id" />
							<Column field="amount" header="Amount" />
							<Column field="amountPaid" header="Amount Paid" />
							<Column field="description" header="Description" />
						</DataTable>}
					<Dialog
						header="Delete the contract"
						visible={deleteDialog}
						style={{ width: '20rem' }}
						footer={<>
							<Button label="Delete" icon="pi pi-check" onClick={deleteContract}
								className="p-button-danger"/>
							<Button label="Cancel" icon="pi pi-times" onClick={() => setDeleteDialog(false)}
								className="p-button-secondary" />
						</>}
						onHide={() => setDeleteDialog(false)}
						maximizable
					>
						Do you want to delete this contract permanently?
					</Dialog>
				</section>
				<section>
					<Button
						className="p-button-danger"
						label="Delete contract"
						icon="pi pi-trash"
						iconPos="left"
						onClick={() => setDeleteDialog(true)}
					/>
				</section>
			</> : <>404 Not Found</>
		}
	</div>);
};

export default ContractPage;
