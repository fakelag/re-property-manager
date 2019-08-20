import React, { useEffect, useState } from 'react';
// import router from '../router';
import ITransaction from '../interfaces/Transaction';
import moment from 'moment';
// import { useSelector } from 'react-redux';
// import { IStore } from '../store';
import { transactionApi } from '../api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';

const TransactionPage = () => {
	const [isError, setIsError] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [transactions, setTransactions] = useState<ITransaction[]>([]);

	// const growl = useSelector<IStore, IStore['growl']>((state) => state.growl);

	useEffect(() => {
		transactionApi.fetchTransactionList()
			.then((trList) => setTransactions(trList))
			.catch(() => setIsError(true))
			.finally(() => setIsLoading(false));
	}, []);

	if (isError)
		return (<>Network Error</>);

	return (<div className="ContractPage">
		{isLoading ? <ProgressSpinner /> :
			<div className="PageCards">
				<Card className="PageCard" title="Transactions">
					<section>
						<DataTable
							paginator
							rows={20}
							value={transactions.map((tr) => ({
								...tr,
								amount: <p>{tr.amount / 100} &euro;</p>,
								date: <p>{moment(new Date(tr.date)).format('DD.MM.YYYY')}</p>,
							}))}
							selectionMode="single"
							// onRowSelect={(e: { originalEvent: Event; data: IInvoice; type: string; }) =>
							// 	router.push(`/invoice/${e.data.id}`)}
						>
							<Column field="date" header="Date" />
							<Column field="amount" header="Amount" />
						</DataTable>
						<Dialog
							maximizable
							header="Delete this contract"
							visible={isUploadDialog}
							footer={<>
								<Button label="Upload" icon="pi pi-check" onClick={uploadCsv}
									className="p-button-danger"/>
								<Button label="Cancel" icon="pi pi-times" onClick={() => setIsUploadDialog(false)}
									className="p-button-secondary" />
							</>}
							onHide={() => setIsUploadDialog(false)}
						>
						</Dialog>
					</section>
					<section>
						<Button
							type="button"
							className="p-button-info"
							label="Upload transactions"
							icon="pi pi-plus"
							iconPos="left"
							onClick={() => {
								if (inputRef.current)
									inputRef.current.click();
							}}
						/>
						<input
							ref={inputRef}
							type="file"
							name="file"
							onChange={selectFile}
						/>
					</section>
				</Card>
			</div>
		}
	</div>);
};

export default TransactionPage;
