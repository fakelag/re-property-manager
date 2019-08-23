import React, { useEffect, useState } from 'react';
// import router from '../router';
import ITransaction from '../interfaces/Transaction';
import moment from 'moment';
import jsMoney from 'js-money';
import { useSelector } from 'react-redux';
import { IStore } from '../store';
import { transactionApi } from '../api';
import { parse } from 'papaparse';
import { TreeTable } from 'primereact/treetable';
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
		description?: string;
	}>({});

	const transactionFields = ['amount', 'date', 'description'];
	const growl = useSelector<IStore, IStore['growl']>((state) => state.growl);

	useEffect(() => {
		transactionApi.fetchTransactionList()
			.then((trList) => setTransactions(trList))
			.catch(() => setIsError(true))
			.finally(() => setIsLoading(false));
	}, []);

	const convertAmount = (amountField: string, useConversion: boolean) => {
		const amountNoSymbols = amountField.replace(/(?![0-9,\.])./g, '');

		if (amountNoSymbols.indexOf('.') !== -1 && useConversion)
			throw new Error('parsing_error_dot_colon_inconsistency');

		const spacelessAmount = amountNoSymbols.split(' ').join('');
		const convertedAmount = useConversion
			? spacelessAmount.split(',').join('.') // we don't have dots, which means we replace colons with dots
			: spacelessAmount.split(',').join(''); // we do have dots, just remove all colons

		try {
			const decimalAmount = Number.parseFloat(convertedAmount);
			const moneyAmount = jsMoney.fromDecimal(decimalAmount, 'EUR');

			return moneyAmount;
		} catch (err) {
			console.error(err);
			throw err;
		}
	};

	const processAmountFields = (amounts: string[]) => {
		if (amounts.length <= 0)
			return [false, []];

		const useConversion = amounts[0].indexOf('.') === -1;

		try {
			const amountsResult = amounts.map((am) => convertAmount(am, useConversion));
			return [false, amountsResult];
		} catch (err) {
			console.error(err);
			return [true, []];
		}
	};

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
		const mapArray = Object.entries(transactionToCsvColumns);
		if (mapArray.find(([key, value]) => value === undefined) !== undefined
			|| mapArray.length === 0) {
			if (growl) {
				growl.show({
					closable: true,
					detail: 'Select all fields required for transactions',
					life: 5000,
					severity: 'error',
					sticky: false,
					summary: 'Select all fields',
				});
			}
		}

		try {
			const transactionsToSend = stmtsJsonAndColumns.data.map((row: any) => {
				const transaction: { [key: string]: any } = {};

				mapArray.forEach(([key, value]) => {
					transaction[key] = row[value!];
				});

				return transaction;
			}).map((trData: any) => {
				return {
					...trData,
					amount: typeof trData.amount === 'string'
						? convertAmount(trData.amount, trData.amount.indexOf('.') === -1).getAmount()
						: trData.amount,
					currency: 'EUR',
				} as ITransaction;
			});

			transactionApi.createTransactionList(transactionsToSend)
				.then((transactionsCreated) => {
					if (growl) {
						growl.show({
							closable: true,
							detail: 'New transactions created succrssfully.',
							life: 5000,
							severity: 'success',
							sticky: false,
							summary: 'Transactions created',
						});
					}

					setTransactions([...transactions, ...transactionsCreated]);
					setIsUploadDialog(false);
				})
				.catch((err) => {
					if (growl) {
						growl.show({
							closable: true,
							detail: String(err),
							life: 5000,
							severity: 'error',
							sticky: false,
							summary: 'Unable to create transactions',
						});
					}
				});
		} catch (err) {
			if (growl) {
				growl.show({
					closable: true,
					detail: 'Unable to parse transactions. Check that all the fields are in the correct format.',
					life: 5000,
					severity: 'error',
					sticky: false,
					summary: 'Parsing error',
				});
			}
		}
	};

	if (isError)
		return (<>Network Error</>);

	const treeTableData = transactions.map((tr) => ({
		children: [],
		data: {
			...tr,
			amount: <p>{tr.amount / 100} &euro;</p>,
			date: <p>{moment(new Date(tr.date)).format('DD.MM.YYYY')}</p>,
		},
		key: tr.id,
	}));

	return (<div className="ContractPage">
		{isLoading ? <ProgressSpinner /> :
			<div className="PageCards">
				<Card className="PageCard" title="Transactions">
					<section>
						<TreeTable
							paginator
							rows={20}
							value={treeTableData}
							selectionMode="single"
							// onRowSelect={(e: { originalEvent: Event; data: IInvoice; type: string; }) =>
							// 	router.push(`/invoice/${e.data.id}`)}
						>
							<Column field="id" header="Id" />
							<Column field="amount" header="Amount" />
							<Column field="description" header="Description" />
							<Column field="date" header="Date" />
						</TreeTable>
						<Dialog
							header="Upload statements CSV"
							visible={isUploadDialog}
							footer={<>
								<Button label="Upload" icon="pi pi-check" onClick={uploadCsv}
									className="p-button-success"/>
								<Button label="Cancel" icon="pi pi-times" onClick={() => setIsUploadDialog(false)}
									className="p-button-secondary" />
							</>}
							onHide={() => setIsUploadDialog(false)}
						>
							<DataTable
								paginator
								rows={20}
								value={stmtsJsonAndColumns.data}
								selectionMode="single"
							>
								{stmtsJsonAndColumns.columns.map((col) => {
									const connectValue = Object.entries(transactionToCsvColumns).find(([key, value]) => value === col);
									const dropdownValue = connectValue ? connectValue[0] : undefined;

									return (<Column
										field={col}
										style={{ width: '12rem' }}
										header={<div style={{ display: 'flex', flexDirection: 'column' }}>
											<Dropdown
												placeholder="Select field"
												value={dropdownValue}
												options={transactionFields.map((field) => ({ label: field, value: field })).concat([
													{ label: '[[Reset]]', value: 'none' },
												])}
												onChange={(e) => {
													const trToCsv: { [key: string]: any } = {};

													transactionFields.forEach((trField) => {
														if ((transactionToCsvColumns as any)[trField] !== col)
															trToCsv[trField] = (transactionToCsvColumns as any)[trField];
														else
															trToCsv[trField] = undefined;
													});

													trToCsv[e.value] = col;

													if (e.value === 'none')
														trToCsv[e.value] = undefined;

													if (e.value === 'amount') {
														// warn if the fields don't match the format /^\-?\d+\.\d\d$/
														const amountsProcessed = processAmountFields(stmtsJsonAndColumns.data.map((data) =>
															data[trToCsv[e.value]]));

														if (amountsProcessed[0]) {
															if (growl) {
																growl.show({
																	closable: true,
																	detail: 'Error parsing amount fields. Make sure amounts are in format 0.00',
																	life: 5000,
																	severity: 'warn',
																	sticky: false,
																	summary: 'Parsing error',
																});
															}
														}
													}

													setTransactionToCsvColumns(trToCsv);
												}}
											/>
											<span style={{ marginTop: '.25rem', fontSize: '0.5rem' }}>Field for: "{col}"</span>
										</div>}
								/>);
								})}
							</DataTable>
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
