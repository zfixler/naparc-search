import { useState, useEffect, useRef } from 'react';
import rpcna from './api/rpcna.json';
import opc from './api/opc.json'
import Header from './components/Header';
import Search from './components/Search';
import Card from './components/Card';
import Fuse from 'fuse.js';

function App() {
	const [searchTerm, setSearchTerm] = useState('');
	const [allCong, setAllCong] = useState([]);
	const [searchResult, setSearchResult] = useState([]);

	const searchRef = useRef(null);

	useEffect(() => {
		setAllCong(opc.concat(rpcna));
		searchRef.current.focus()

	}, []);

	useEffect(() => {
		const options = {
			includeScore: true,
			ignoreLocation: true,
			isCaseSensitive: true,
			keys: ['denom', 'name', 'pastor', 'address'],
		};

		const fuse = new Fuse(allCong, options);

		if (searchTerm.length > 1) {
			const result = fuse.search(searchTerm);
			setSearchResult(result);
		} else {
			setSearchResult([])
		}
		
	}, [searchTerm, allCong]);

	const display = searchResult.slice(0, 10).map((cong) => (
		<Card key={cong.item.id} props={cong.item} />
	));

	return (
		<>
			<Header />
			<Search props={({searchTerm , setSearchTerm, searchRef})} />
			<main>{searchTerm && display}</main>
		</>
	);
}

export default App;
