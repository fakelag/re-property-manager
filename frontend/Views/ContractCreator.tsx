import React, { useState, useEffect } from 'react';
import jsMoney from 'js-money';
import { useSelector } from 'react-redux';
import { IStore } from '../store';
import { match as MatchParams } from 'react-router';
import { contractApi } from '../api';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import IContract from '../interfaces/Contract';
import router from '../router';

const ContractCreator = ({ match }: { match: MatchParams<{ propertyId: string, contractId?: string }> }) => {
	const [isError, setIsError] = useState(false);
	const [contract, setContract] = useState<IContract>({
		additionalConditions: '',
		additionalEquipment: '',
		beginDate: new Date(),
		endDate: null,
		id: '',
		participant: {
			address: '',
			email: '',
			fullName: '',
			phone: '',
			ssn: '',
		},
		paymentAmount: 70000,
		paymentDayOfMonth: 27,
		property: '',
		// paymentRaise?: {
		// 	costIndexDate: Date;
		// };
		// securityDeposit?: {
		// 	depositAmount: Date;
		// 	depositDate: Date;
		// };
		signDate: new Date(),
	});

	const growl = useSelector<IStore, IStore['growl']>((state) => state.growl);

	useEffect(() => {
		if (match.params.contractId) {
			contractApi.fetchContract(match.params.contractId)
				.then((ctr) => setContract(ctr))
				.catch((err) => setIsError(true));
		}
	}, []);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		event.stopPropagation();

		let newContractId = '';

		if (match.params.contractId) {
			contractApi.updateContract(match.params.propertyId, match.params.contractId, contract)
				.then((ctr) => {
					if (growl) {
						growl.show({
							closable: true,
							detail: 'Contract has been updated.',
							life: 5000,
							severity: 'success',
							sticky: false,
							summary: 'Contract updated',
						});
					}

					newContractId = ctr.id;
					setContract(ctr);
				})
				.catch(() => setIsError(true))
				.finally(() => router.push(`/contract/${match.params.propertyId}/${newContractId}`));
		} else {
			contractApi.createContract(match.params.propertyId, contract)
				.then((ctr) => {
					if (growl) {
						growl.show({
							closable: true,
							detail: 'Contract has been created.',
							life: 5000,
							severity: 'success',
							sticky: false,
							summary: 'Contract created',
						});
					}

					newContractId = ctr.id;
					setContract(ctr);
				})
				.catch(() => setIsError(true))
				.finally(() => router.push(`/contract/${match.params.propertyId}/${newContractId}`));
		}
	};

	if (isError)
		return (<>Network Error</>);

	return (<form className="CreateContractForm" onSubmit={handleSubmit}>
		<article>
			<Card className="ContractCreatorCard" title={match.params.contractId
				? `Contract Id ${match.params.contractId}`
				: 'New Contract'}
			>
				<div className="p-card-subtitle">Tenant Contact Details</div>
				<section>
					<span className="p-float-label">
						<InputMask
							id="input-tenant-phone"
							type="text"
							mask="(999) 999-9999"
							value={contract.participant.phone}
							onChange={(e) => {
									setContract({
										...contract,
										participant: {
											...contract.participant,
											phone: e.value,
										},
									});
								}
							}
						/>
						<label htmlFor="input-tenant-phone">Phone Number</label>
					</span>
					<span className="p-float-label">
						<InputText
							id="input-tenant-email"
							type="text"
							value={contract.participant.email}
							onChange={(e) => {
									setContract({
										...contract,
										participant: {
											...contract.participant,
											email: e.currentTarget.value,
										},
									});
								}
							}
						/>
						<label htmlFor="input-tenant-email">Email Address</label>
					</span>
					<span className="p-float-label">
						<InputText
							id="input-tenant-fullName"
							type="text"
							value={contract.participant.fullName}
							onChange={(e) => {
									setContract({
										...contract,
										participant: {
											...contract.participant,
											fullName: e.currentTarget.value,
										},
									});
								}
							}
						/>
						<label htmlFor="input-tenant-fullName">Full Name</label>
					</span>
					<span className="p-float-label">
						<InputText
							id="input-tenant-ssn"
							type="text"
							value={contract.participant.ssn}
							onChange={(e) => {
									setContract({
										...contract,
										participant: {
											...contract.participant,
											ssn: e.currentTarget.value,
										},
									});
								}
							}
						/>
						<label htmlFor="input-tenant-ssn">Social Security Number</label>
					</span>
					<span className="p-float-label">
						<InputText
							id="input-tenant-address"
							type="text"
							value={contract.participant.address}
							onChange={(e) => {
									setContract({
										...contract,
										participant: {
											...contract.participant,
											address: e.currentTarget.value,
										},
									});
								}
							}
						/>
						<label htmlFor="input-tenant-address">Address</label>
					</span>
				</section>
				<div className="p-card-subtitle">Rent</div>
				<section>
					<span className="p-float-label">
						<div className="p-inputgroup">
							<span className="p-inputgroup-addon">€</span>
							<InputText
								id="input-rent-amount"
								type="text"
								value={jsMoney.fromInteger(contract.paymentAmount, 'EUR').toString()}
								onChange={(e) => {
										try {
											setContract({
												...contract,
												paymentAmount: e.currentTarget.value
													? Number.parseInt(e.currentTarget.value, 10) * 100
													: 0,
											});
										} catch (err) {
											console.error(err);
										}
									}
								}
							/>
							<label htmlFor="input-rent-amount">Payment Amount</label>
						</div>
					</span>
					<span className="p-float-label">
						<InputText
							id="input-rent-dom"
							type="text"
							keyfilter={/([1-9]|[12]\d|3[01])/}
							maxLength={2}
							value={contract.paymentDayOfMonth.toString()}
							onChange={(e) => {
									try {
										setContract({
											...contract,
											paymentDayOfMonth: e.currentTarget.value
												? Number.parseInt(e.currentTarget.value, 10)
												: 1,
										});
									} catch (err) {
										console.error(err);
									}
								}
							}
						/>
						<label htmlFor="input-rent-dom">Payment Day Of Month</label>
					</span>
					<span className="p-float-label">
						<Calendar
							value={new Date(contract.beginDate)}
							dateFormat="dd.mm.yy"
							onChange={(e) => {
								setContract({
									...contract,
									beginDate: Array.isArray(e.value)
										? e.value[0]
										: e.value,
								});
							}}
							showButtonBar={false}
						/>
						<label htmlFor="input-rent-dom">Begin Date</label>
					</span>
					<span className="p-float-label">
						<Calendar
							value={contract.endDate ? new Date(contract.endDate) : undefined}
							dateFormat="dd.mm.yy"
							onChange={(e) => {
								setContract({
									...contract,
									endDate: Array.isArray(e.value)
										? e.value[0]
										: e.value,
								});
							}}
							onClearButtonClick={() => {
								setContract({
									...contract,
									endDate: null,
								});
							}}
							showButtonBar={true}
						/>
						<label htmlFor="input-rent-dom">End Date</label>
					</span>
				</section>
				<div className="p-card-subtitle">Additional Details</div>
				<section style={{ flexDirection: 'column', marginRight: '0rem' }}>
					<InputTextarea
						placeholder="Additional Rental Conditions"
						rows={5}
						value={contract.additionalConditions}
						onChange={(e) => {
							setContract({
								...contract,
								additionalConditions: e.currentTarget.value,
							});
						}}
						autoResize={true}
					/>
					<InputTextarea
						placeholder="Additional Equipment"
						rows={5}
						value={contract.additionalEquipment}
						onChange={(e) => {
							setContract({
								...contract,
								additionalEquipment: e.currentTarget.value,
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
				className={match.params.contractId ? 'p-button-info' : 'p-button-success'}
				label={match.params.contractId ? 'Save' : 'Create'}
				icon="pi pi-check"
				iconPos="left"
			/>
			{match.params.contractId && <Button
				type="button"
				className="p-button-danger"
				label="Delete"
				icon="pi pi-trash"
				iconPos="left"
				onClick={() => {
					contractApi.deleteContract(match.params.propertyId, match.params.contractId!)
						.then(() => router.push(`/property/${match.params.propertyId}`))
						.catch(() => {
							if (growl) {
								growl.show({
									closable: true,
									detail: 'A network error occurred while deleting the contract.',
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
									detail: 'Contract has been deleted.',
									life: 5000,
									severity: 'success',
									sticky: false,
									summary: 'Contract deleted',
								});
							}
						});
				}}
			/>}
		</article>
	</form>);
};

export default ContractCreator;
