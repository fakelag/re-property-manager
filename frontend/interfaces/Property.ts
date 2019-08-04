import IContract from './Contract';

export default interface IProperty {
	id: string;
	address: string;
	city: string;
	zip: string;
	debtFreePrice: number;
	sellingPrice: number;
	maintenanceFee: number;
	financeFee: number;
	repairFee: number;
	apartmentType: string;
	livingArea: number;
	owner: string;
	contracts: IContract[];
}
