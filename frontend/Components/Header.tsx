import React from 'react';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

const Header = ({ searchPlaceholder, onSearch }:
{ searchPlaceholder: string, onSearch(searchString: string): void }) => {
	const items = [
		{
			icon: 'pi pi-fw pi-home',
			items: [
				{
					icon: 'pi pi-fw pi-plus',
					items: [
						{
							command: (e: { originalEvent: Event }): void => {
								if (e.originalEvent.type === 'click') {
									// create a new prop
								}
							},
							icon: 'pi pi-fw pi-file',
							label: 'Rental Property',
						},
					],
					label: 'New',
				},
				{
					separator: true,
				},
				{
					icon: 'pi pi-fw pi-external-link',
					label: 'Export',
				},
			],
			label: 'Property',
		},
	];

	return (<Menubar
		model={items}
	>
		<InputText
			placeholder={searchPlaceholder}
			type="text"
			style={{ marginRight: '0.25rem' }}
			onChange={(e) => onSearch(e.currentTarget.value)}
		/>
		<Button
			label="Log Out"
			icon="pi pi-sign-out"
			onClick={(e) => window.location.href = "/api/user/logout"}
		/>
	</Menubar>);
};

export default Header;
