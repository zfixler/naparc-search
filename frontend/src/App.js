import { useState, useEffect, useRef } from 'react';
import rpcna from './api/rpcna.json';
import opc from './api/opc.json';
import hrc from './api/hrc.json';
import prc from './api/prc.json';
import urcna from './api/urcna.json';
import Header from './components/Header';
import Search from './components/Search';
import Card from './components/Card';
import { distance } from './utils/utils';

function App() {
	const [searchTerm, setSearchTerm] = useState('');
	const [allCong, setAllCong] = useState([]);
	const [searchResult, setSearchResult] = useState(null);
	const [location, setLocation] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const searchRef = useRef(null);

	const handleSubmit = (e) => {
		e.preventDefault();
		setLoading(true);
		const regexUs = /\d{5}/;
		const regexCa = /[A-Z]\d[A-Z]/;

		if (regexUs.test(searchTerm) && searchTerm.length === 5) {
			setLocation(searchTerm);
		} else if (regexCa.test(searchTerm) && searchTerm.length === 3) {
			setLocation(searchTerm);
		} else {
			setSearchResult(null);
			setLoading(false);
		}
	};

	const getPosition = async (i) => {
		if (i.length === 5) {
			const data = await fetch(`http://api.zippopotam.us/us/${i}`);
			const json = await data.json();
			if(json.places !== undefined){
				return { lat: json.places[0].latitude, long: json.places[0].longitude };
			} else { return 'This ZIP code is incorrect.'}

			
		} else if (i.length === 3) {
			const data = await fetch(`http://api.zippopotam.us/CA/${i}`);
			const json = await data.json();

			if(json.places !== undefined){
				return { lat: json.places[0].latitude, long: json.places[0].longitude };
			} else { return 'This postal code is incorrect.'}
		}
	};

	const sortSearch = async (location) => {
		const searchArea = await getPosition(location).catch((error) =>
			setError(error)
		);
		if(typeof searchArea !== 'string'){
		const filteredArr = allCong.filter((cong) => cong !== null);
		const congArr = filteredArr.map((cong) => {
			const d = distance(cong.lat, cong.long, searchArea.lat, searchArea.long);

			cong.d = d;
			return cong;
		});
		return congArr;
		} else { setError(searchArea); setLoading(false); setSearchResult(null) }
	};

	useEffect(() => {
		searchRef.current.focus();
		setAllCong(opc.concat(rpcna).concat(hrc).concat(urcna).concat(prc));
	}, []);

	useEffect(() => {
		let isCancelled = false;

		const search = async () => {
			if (location !== '' && !isCancelled) {
				const results = await sortSearch(location).catch((error) =>
					setError(error)
				);
				if (results !== undefined && !isCancelled) {
					setLoading(false);
					setError('')
					setSearchResult(results.sort((a, b) => a.d - b.d));
				}
			}
		};

		search().catch((error) => console.log(error));

		return () => {
			isCancelled = true;
		};
	}, [location]);

	const instructions =
		'Please enter a 5 digit U.S. Zip Code, or the first 3 digits of a Canadian postal code.';

	const display =
		searchResult !== null ? (
			searchResult
				.slice(0, 12)
				.map((cong) => <Card key={cong.id} props={cong} />)
		) : (
			<p>{instructions}</p>
		);

	return (
		<>
			<Header />
			<Search props={{ searchTerm, setSearchTerm, searchRef, handleSubmit }} />		
			<main>{loading ? <p>Loading..</p> : error ? <p>{error}</p> : display}</main>
			
		</>
	);
}

export default App;
