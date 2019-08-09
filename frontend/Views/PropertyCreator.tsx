import React, { useState } from 'react';
import { propertyApi } from '../api';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import IProperty from '../interfaces/Property';

const PropertyCreator = () => {
	const [property, setProperty] = useState<IProperty>({
		address: '',
		apartmentType: '',
		city: '',
		contracts: [],
		debtFreePrice: 8900000,
		financeFee: 9000,
		id: '',
		livingArea: 30.0,
		maintenanceFee: 5000,
		owner: '',
		repairFee: 0.0,
		sellingPrice: 9000000,
		zip: '',
	});

	const createOrUpdateProperty = async () => {
		if (property.id) {
			propertyApi.updateProperty(property.id, property)
				.then((data) => data && setProperty(data));
		} else {
			propertyApi.createProperty(property)
				.then((data) => data && setProperty(data));
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
					<div className="p-inputgroup">
						<span className="p-inputgroup-addon">€</span>
						<InputText
							id="input-address"
							type="text"
							value={property.debtFreePrice / 100.0}
							onChange={(e) => {
									try {
										setProperty({
											...property,
											debtFreePrice: e.currentTarget.value
												? Number.parseInt(e.currentTarget.value, 10) * 100
												: 0,
										});
									} catch (err) {
										console.error(err);
									}
								}
							}
						/>
						<span className="p-inputgroup-addon">.00</span>
						<label htmlFor="input-address">Debt Free Price</label>
					</div>
				</span>
				<span className="p-float-label" style={{ marginBottom: '1rem' }}>
					<div className="p-inputgroup">
						<span className="p-inputgroup-addon">€</span>
						<InputText
							id="input-address"
							type="text"
							value={property.sellingPrice / 100.0}
							onChange={(e) => {
									try {
										setProperty({
											...property,
											sellingPrice: e.currentTarget.value
												? Number.parseInt(e.currentTarget.value, 10) * 100
												: 0,
										});
									} catch (err) {
										console.error(err);
									}
								}
							}
						/>
						<span className="p-inputgroup-addon">.00</span>
						<label htmlFor="input-address">Selling Price</label>
					</div>
				</span>
				<span className="p-float-label" style={{ marginBottom: '1rem' }}>
					<div className="p-inputgroup">
						<span className="p-inputgroup-addon">€</span>
						<InputText
							id="input-address"
							type="text"
							value={property.financeFee / 100.0}
							onChange={(e) => {
									try {
										setProperty({
											...property,
											financeFee: e.currentTarget.value
												? Number.parseInt(e.currentTarget.value, 10) * 100
												: 0,
										});
									} catch (err) {
										console.error(err);
									}
								}
							}
						/>
						<span className="p-inputgroup-addon">.00</span>
						<label htmlFor="input-address">Finance Fee</label>
					</div>
				</span>
				<span className="p-float-label" style={{ marginBottom: '1rem' }}>
					<div className="p-inputgroup">
						<span className="p-inputgroup-addon">€</span>
						<InputText
							id="input-address"
							type="text"
							value={property.maintenanceFee / 100.0}
							onChange={(e) => {
									try {
										setProperty({
											...property,
											maintenanceFee: e.currentTarget.value
												? Number.parseInt(e.currentTarget.value, 10) * 100
												: 0,
										});
									} catch (err) {
										console.error(err);
									}
								}
							}
						/>
						<span className="p-inputgroup-addon">.00</span>
						<label htmlFor="input-address">Maintenance Fee</label>
					</div>
				</span>
				<span className="p-float-label" style={{ marginBottom: '1rem' }}>
					<div className="p-inputgroup">
						<span className="p-inputgroup-addon">€</span>
						<InputText
							id="input-address"
							type="text"
							value={property.repairFee / 100.0}
							onChange={(e) => {
									try {
										setProperty({
											...property,
											repairFee: e.currentTarget.value
												? Number.parseInt(e.currentTarget.value, 10) * 100
												: 0,
										});
									} catch (err) {
										console.error(err);
									}
								}
							}
						/>
						<span className="p-inputgroup-addon">.00</span>
						<label htmlFor="input-address">Repair Fee</label>
					</div>
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
