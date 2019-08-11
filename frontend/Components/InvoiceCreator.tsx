import React, { useState, useEffect } from 'react';
import { match as MatchParams } from 'react-router';
import { invoiceApi } from '../api';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import IInvoice from '../interfaces/Invoice';
import router from '../router';

const ContractCreator = ({ match }: { match: MatchParams<{ invoiceId?: string }> }) => {
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
		linkedContract: null,
		owner: '',
	});

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
				.finally(() => router.goBack());
		} else {
			invoiceApi.createInvoice(invoice)
				.then((inv) => setInvoice(inv))
				.catch(() => setIsError(true))
				.finally(() => router.goBack());
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
							disabled={!!match.params.invoiceId}
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
						placeholder="Additional Rental Conditions"
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
			</Card>
		</article>
		<article>
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
						.then(() => router.goBack());
				}}
			/>}
		</article>
	</form>);
};

export default ContractCreator;
