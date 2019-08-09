import React, { useState } from 'react';
import { match as MatchParams } from 'react-router';
import { contractApi } from '../api';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import IContract from '../interfaces/Contract';

const ContractCreator = ({ match }: { match: MatchParams<{ propertyId: string }> }) => {
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
		paymentDateOfMonth: 27,
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

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		event.stopPropagation();
		contractApi.addContract(match.params.propertyId, contract)
			.then((ctr) => console.log('created: ', ctr));
	};

	return (<form className="CreateContractForm" onSubmit={handleSubmit}>
		<article>
			<section>
			</section>
		</article>
		<Button
			type="submit"
			className="p-button-success"
			label="Create"
			icon="pi pi-check"
			iconPos="left"
		/>
	</form>);
};

export default ContractCreator;
