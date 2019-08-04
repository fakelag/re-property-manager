import React, { useState } from 'react';
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
			<PropertyList filterByAddress={searchString} />
		</section>
	</>);
};

export default App;
