import React, { useState } from 'react';
import axios from 'axios';
import IProperty from '../interfaces/Property';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const PropertyCreator = () => {
	const [property, setProperty] = useState<Partial<IProperty>>({
		address: '',
		apartmentType: '',
		city: '',
		contracts: [],
		debtFreePrice: 89000.0,
		financeFee: 90.0,
		id: '',
		livingArea: 30.0,
		maintenanceFee: 50.0,
		repairFee: 0.0,
		sellingPrice: 90000.0,
		zip: '',
	});

	const createOrUpdateProperty = async () => {
		try {
			const response = property.id
				? await axios.post<IProperty>('/api/property', { id: property.id, propertyIn: property })
				: await axios.put<IProperty>('/api/property', property);

			if ((response.status === 200 // Ok
				|| response.status === 201) // Created
				&& response.data) {
				setProperty(response.data);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		event.stopPropagation();
		createOrUpdateProperty();
	};

	return (<form className="CreatePropertyForm" onSubmit={handleSubmit}>
		<article>
			<section>
				<span className="p-float-label" style={{ marginBottom: '1rem' }}>
					<InputText
						disabled
						id="input-id"
						type="text"
						value={property.id}
					/>
					<label htmlFor="input-id">Id</label>
				</span>
				<span className="p-float-label" style={{ marginBottom: '1rem' }}>
					<InputText
						id="input-address"
						type="text"
						value={property.address}
						onChange={(e) => setProperty({ ...property, address: e.currentTarget.value })}
					/>
					<label htmlFor="input-address">Address</label>
				</span>
				<span className="p-float-label" style={{ marginBottom: '1rem' }}>
					<InputText
						id="input-address"
						type="text"
						value={property.apartmentType}
						onChange={(e) => setProperty({ ...property, apartmentType: e.currentTarget.value })}
					/>
					<label htmlFor="input-address">Apartment Type</label>
				</span>
				<span className="p-float-label" style={{ marginBottom: '1rem' }}>
					<InputText
						id="input-address"
						type="text"
						value={property.city}
						onChange={(e) => setProperty({ ...property, city: e.currentTarget.value })}
					/>
					<label htmlFor="input-address">City</label>
				</span>
				<span className="p-float-label" style={{ marginBottom: '1rem' }}>
					<InputText
						id="input-address"
						type="text"
						value={property.zip}
						onChange={(e) => setProperty({ ...property, zip: e.currentTarget.value })}
					/>
					<label htmlFor="input-address">Zip Code</label>
				</span>
			</section>
			<section>
				<span className="p-float-label" style={{ marginBottom: '1rem' }}>
					<InputText
						id="input-address"
						type="text"
						value={property.debtFreePrice}
						onChange={(e) => {
								try {
									setProperty({ ...property, debtFreePrice: Number.parseFloat(e.currentTarget.value) });
								} catch (err) {
									console.error(err);
								}
							}
						}
					/>
					<label htmlFor="input-address">Debt Free Price</label>
				</span>
				<span className="p-float-label" style={{ marginBottom: '1rem' }}>
					<InputText
						id="input-address"
						type="text"
						value={property.sellingPrice}
						onChange={(e) => {
								try {
									setProperty({ ...property, sellingPrice: Number.parseFloat(e.currentTarget.value) });
								} catch (err) {
									console.error(err);
								}
							}
						}
					/>
					<label htmlFor="input-address">Selling Price</label>
				</span>
				<span className="p-float-label" style={{ marginBottom: '1rem' }}>
					<InputText
						id="input-address"
						type="text"
						value={property.financeFee}
						onChange={(e) => {
								try {
									setProperty({ ...property, financeFee: Number.parseFloat(e.currentTarget.value) });
								} catch (err) {
									console.error(err);
								}
							}
						}
					/>
					<label htmlFor="input-address">Finance Fee</label>
				</span>
				<span className="p-float-label" style={{ marginBottom: '1rem' }}>
					<InputText
						id="input-address"
						type="text"
						value={property.maintenanceFee}
						onChange={(e) => {
								try {
									setProperty({ ...property, maintenanceFee: Number.parseFloat(e.currentTarget.value) });
								} catch (err) {
									console.error(err);
								}
							}
						}
					/>
					<label htmlFor="input-address">Maintenance Fee</label>
				</span>
				<span className="p-float-label" style={{ marginBottom: '1rem' }}>
					<InputText
						id="input-address"
						type="text"
						value={property.repairFee}
						onChange={(e) => {
								try {
									setProperty({ ...property, repairFee: Number.parseFloat(e.currentTarget.value) });
								} catch (err) {
									console.error(err);
								}
							}
						}
					/>
					<label htmlFor="input-address">Repait Fee</label>
				</span>
			</section>
		</article>
		<Button
			type="submit"
			className={property.id ? 'p-button-info' : 'p-button-success'}
			label={property.id ? 'Save' : 'Create'}
			icon="pi pi-check"
			iconPos="left"
		/>
	</form>);
};

export default PropertyCreator;
