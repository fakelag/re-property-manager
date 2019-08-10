import React, { useState } from 'react';
import { Router, Route, Switch } from 'react-router';
import history from '../router';
import PropertyPage from './PropertyPage';
import PropertyCreator from './PropertyCreator';
import ContractCreator from './ContractCreator';
import Header from '../Components/Header';
import PropertyList from '../Components/PropertyList';

const App = () => {
	const [searchString, setSearchString] = useState<string>('');

	return (<>
		<Header
			searchPlaceholder="Search properties..."
			onSearch={(filterString: string) => setSearchString(filterString)}
		/>
		<article className="Dashboard">
			<Router history={history}>
				<Switch>
					<Route
						exact
						path="/property/:propertyId"
						component={PropertyPage}
					/>
					<Route
						exact
						path="/propertysettings"
						component={PropertyCreator}
					/>
					<Route
						exact
						path="/contractsettings/:propertyId/:contractId?"
						component={ContractCreator}
					/>
					<Route
						path="*"
						render={function renderPropertyList() { return <PropertyList filterByAddress={searchString} />; }}
					/>
				</Switch>
			</Router>
		</article>
	</>);
};

export default App;
