import React from 'react';
import router from '../router';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

const Header = ({ searchPlaceholder, onSearch }:
{ searchPlaceholder: string, onSearch(searchString: string): void }) => {
	const items = [
		{
			command: (e: { originalEvent: Event }): void => {
				if (e.originalEvent.type === 'click') {
					router.push('/');
				}
			},
			icon: 'pi pi-fw pi-home',
			label: 'Home',
		},
		{
			icon: 'pi pi-fw pi-briefcase',
			items: [
				{
					icon: 'pi pi-fw pi-plus',
					items: [
						{
							command: (e: { originalEvent: Event }): void => {
								if (e.originalEvent.type === 'click') {
									router.push('/propertysettings');
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
			label: 'Properties',
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
