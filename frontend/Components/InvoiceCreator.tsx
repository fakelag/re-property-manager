import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IStore } from '../store';
import { match as MatchParams } from 'react-router';
import { Location } from 'history';
import { invoiceApi } from '../api';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import IInvoice from '../interfaces/Invoice';
import router from '../router';
import queryString from 'query-string';

const ContractCreator = ({ match, location }: { match: MatchParams<{ invoiceId?: string }>, location: Location }) => {
	const contractField: { contract?: string } = queryString.parse(location.search);

	const [isError, setIsError] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [invoice, setInvoice] = useState<IInvoice>({
		amount: 0,
		amountPaid: 0,
		creationDate: new Date(),
		currency: 'EUR',
		description: '',
		dueDate: new Date(),
		id: '',
		linkedContract: contractField.contract ? contractField.contract : null,
		owner: '',
	});

	const growl = useSelector<IStore, IStore['growl']>((state) => state.growl);

	useEffect(() => {
		if (match.params.invoiceId) {
			invoiceApi.fetchInvoice(match.params.invoiceId)
				.then((inv) => setInvoice(inv))
				.catch(() => setIsError(true))
				.finally(() => setIsLoading(false));
		} else {
			setIsLoading(false);
		}
	}, []);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		event.stopPropagation();

		if (match.params.invoiceId) {
			invoiceApi.updateInvoice(match.params.invoiceId, invoice)
				.then((inv) => setInvoice(inv))
				.catch(() => setIsError(true))
				.finally(() => {
					if (growl) {
						growl.show({
							closable: true,
							detail: 'Invoice has been updated.',
							life: 5000,
							severity: 'success',
							sticky: false,
							summary: 'Invoice updated',
						});
					}

					router.goBack();
				});
		} else {
			invoiceApi.createInvoice(invoice)
				.then((inv) => setInvoice(inv))
				.catch(() => setIsError(true))
				.finally(() => {
					if (growl) {
						growl.show({
							closable: true,
							detail: 'Invoice has been created.',
							life: 5000,
							severity: 'success',
							sticky: false,
							summary: 'Invoice created',
						});
					}

					router.goBack();
				});
		}
	};

	if (isError)
		return (<>Network Error</>);

	if (isLoading)
		return (<ProgressSpinner />);

	return (<form className="CreateInvoiceForm" onSubmit={handleSubmit}>
		<article>
			<Card className="InvoiceCreatorCard" title={match.params.invoiceId
				? `Invoice (${match.params.invoiceId})`
				: 'New Invoice'}
			>
				<div className="p-card-subtitle">Invoice Details</div>
				<section>
					<span className="p-float-label">
						<div className="p-inputgroup">
							<span className="p-inputgroup-addon">€</span>
							<InputText
								id="invoice-amount"
								type="text"
								value={invoice.amount / 100}
								keyfilter="int"
								onChange={(e) => {
									try {
										setInvoice({
											...invoice,
											amount: Number.parseInt(e.currentTarget.value, 10) * 100,
										});
									} catch (err) {
										console.error(err);
									}
								}}
							/>
							<span className="p-inputgroup-addon">.00</span>
							<label htmlFor="invoice-amount">Amount</label>
						</div>
					</span>
					<span className="p-float-label">
						<InputText
							disabled //={!!match.params.invoiceId}
							id="invoice-contract"
							type="text"
							value={invoice.linkedContract || ''}
							keyfilter="int"
							style={{ width: '100%' }}
							onChange={(e) => {
								setInvoice({
									...invoice,
									linkedContract: e.currentTarget.value,
								});
							}}
						/>
						<label htmlFor="invoice-contract">Contract</label>
					</span>
					<span className="p-float-label">
						<Calendar
							value={new Date(invoice.dueDate)}
							dateFormat="dd.mm.yy"
							onChange={(e) => {
								setInvoice({
									...invoice,
									dueDate: Array.isArray(e.value)
										? e.value[0]
										: e.value,
								});
							}}
							showButtonBar={false}
						/>
						<label htmlFor="input-rent-dom">Due Date</label>
					</span>
					<InputTextarea
						placeholder="Invoice description"
						rows={5}
						value={invoice.description}
						onChange={(e) => {
							setInvoice({
								...invoice,
								description: e.currentTarget.value,
							});
						}}
						autoResize={true}
					/>
				</section>
				<section>
					<Button
						type="submit"
						className={match.params.invoiceId ? 'p-button-info' : 'p-button-success'}
						label={match.params.invoiceId ? 'Save' : 'Create'}
						icon="pi pi-check"
						iconPos="left"
					/>
					{match.params.invoiceId && <Button
						type="button"
						className="p-button-danger"
						label="Delete"
						icon="pi pi-trash"
						iconPos="left"
						onClick={() => {
							invoiceApi.deleteInvoice(match.params.invoiceId!)
								.then(() => router.goBack())
								.catch(() => {
									if (growl) {
										growl.show({
											closable: true,
											detail: 'A network error occurred while deleting the invoice.',
											life: 5000,
											severity: 'error',
											sticky: false,
											summary: 'Network error',
										});
									}
								})
								.finally(() => {
									if (growl) {
										growl.show({
											closable: true,
											detail: 'Invoice has been deleted.',
											life: 5000,
											severity: 'success',
											sticky: false,
											summary: 'Invoice deleted',
										});
									}
								});
						}}
					/>}
				</section>
			</Card>
		</article>
	</form>);
};

export default ContractCreator;
