import React, { useEffect, useState } from 'react';
// import router from '../router';
import ITransaction from '../interfaces/Transaction';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { IStore } from '../store';
import { transactionApi } from '../api';
import { parse } from 'papaparse';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';

const TransactionPage = () => {
	const inputRef = React.createRef<HTMLInputElement>();

	const [isError, setIsError] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isUploadDialog, setIsUploadDialog] = useState(false);
	const [transactions, setTransactions] = useState<ITransaction[]>([]);
	const [stmtsJsonAndColumns, setStmtsJsonAndColumns]
		= useState<{ columns: string[], data: any[] }>({
			columns: [],
			data: [],
		});
	const [transactionToCsvColumns, setTransactionToCsvColumns] = useState<{
		amount?: string;
		date?: string;
		currency?: string;
		description?: string;
	}>({});

	const growl = useSelector<IStore, IStore['growl']>((state) => state.growl);

	useEffect(() => {
		transactionApi.fetchTransactionList()
			.then((trList) => setTransactions(trList))
			.catch(() => setIsError(true))
			.finally(() => setIsLoading(false));
	}, []);

	const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.currentTarget.files) {
			parse(event.currentTarget.files[0], {
				complete: (parseResult) => {
		if (parseResult.errors.length) {
			if (growl) {
				growl.show({
					closable: true,
					detail: 'Errors occurred during CSV parsing',
					life: 5000,
					severity: 'error',
					sticky: false,
					summary: 'Unable to parse CSV',
				});
			}

						console.error(parseResult.errors);
		} else {
						console.log(parseResult.meta);
						setStmtsJsonAndColumns({
							columns: parseResult.meta.fields,
							data: parseResult.data,
						});
					}

					setIsUploadDialog(true);
				},
				header: true,
			});
		}
	};

	const uploadCsv = () => {
	};

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
							label="Upload statements"
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
							style={{ display: 'none' }}
						/>
					</section>
				</Card>
			</div>
		}
	</div>);
};

export default TransactionPage;
