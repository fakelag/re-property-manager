import React, { useState } from 'react';
import { Router, Route, Switch } from 'react-router';
import history from '../router';
import PropertyPage from './PropertyPage';
import Header from '../Components/Header';
import PropertyList from '../Components/PropertyList';

const App = () => {
	const [searchString, setSearchString] = useState<string>('');

	return (<>
		<Header
			searchPlaceholder="Search properties..."
			onSearch={(filterString: string) => setSearchString(filterString)}
		/>
		<section className="Dashboard">
			<Router history={history}>
				<Switch>
					<Route
						exact
						path="/property/:propertyId"
						component={PropertyPage}
					/>
					<Route
						path="*"
						render={function renderPropertyList() { return <PropertyList filterByAddress={searchString} />; }}
					/>
				</Switch>
			</Router>
		</section>
	</>);
};

export default App;
