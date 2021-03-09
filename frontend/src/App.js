
import {useState} from 'react'
import Header from './components/Header';
import Search from './components/Search';
import Card from './components/Card';
import Faq from './components/Faq';
import Key from './components/Key';
import useSearch from './hooks/useSearch'




function App() {
	const { searchResult, searchTerm, setSearchTerm, searchRef, handleSubmit, loading, error } = useSearch()
	
	const [info, setInfo] = useState(0)

	const instructions =
		'Please enter a 5 digit U.S. Zip Code, or the first 3 digits of a Canadian postal code.';

	const display =
		searchResult !== null ? (
			searchResult
				.slice(0, 12)
				.map((cong) => <Card key={cong.id} props={cong} />)
		) : (
			<p className='message'>{instructions}</p>
		);

	return (
		<>
			<Header props={{ setInfo }}/>
			<Search props={{ searchTerm, setSearchTerm, searchRef, handleSubmit }} />		
			<main>{loading ? <p className='message'>Loading..</p> : error ? <p className='message'>{error}</p> : display}</main>
			{info === 1 ? <Faq props={{ setInfo }} /> : info === 2 ? <Key props={{ setInfo }} /> : null}
		</>
	);
}

export default App;
