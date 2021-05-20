import { useState, useEffect } from 'react';
import { distance } from '../utils/utils';

function useSearch() {
	const [searchTerm, setSearchTerm] = useState('');
	const [searchResult, setSearchResult] = useState(null);
	const [location, setLocation] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [page, setPage] = useState(1);
	const [allCong, setAllCong] = useState([]);

	const denoms = ['pca', 'opc', 'arp', 'rpcna', 'urcna', 'hrc', 'prc', 'frcna'];

	const checkLoading = () => {
		if (loading === true) {
			setLoading(false);
			setError('Something went wrong. Please try again.');
		}
	};

	useEffect(() => {
		denoms.forEach((denom) => {
			fetch(`/api/${denom}.json`)
				.then((res) => res.json())
				.then((json) => allCong.push(...json))
				.catch((error) => console.log(error));
		});
	}, []);

	useEffect(() => {
		let loadingTimeout = setTimeout(checkLoading, 5000);
		return () => clearTimeout(loadingTimeout);
	}, [loading]);

	const handleSubmit = (e) => {
		e.preventDefault();
		setLoading(true);
		const regexUs = /\d{5}/;
		const regexCa = /[A-Z]\d[A-Z]/;

		if (searchTerm === location) {
			setLoading(false);
		} else if (regexUs.test(searchTerm) && searchTerm.length === 5) {
			setLocation(searchTerm);
		} else if (
			regexCa.test(searchTerm.toUpperCase()) &&
			searchTerm.length === 3
		) {
			setLocation(searchTerm);
		} else {
			setSearchResult(null);
			setLoading(false);
		}
	};

	const getPosition = async (i) => {
		if (i.length === 5) {
			const data = await fetch(`https://api.zippopotam.us/us/${i}`);
			const json = await data.json();
			if (json.places !== undefined) {
				return { lat: json.places[0].latitude, long: json.places[0].longitude };
			} else {
				return 'This ZIP code is incorrect.';
			}
		} else if (i.length === 3) {
			const data = await fetch(`https://api.zippopotam.us/CA/${i}`);
			const json = await data.json();

			if (json.places !== undefined) {
				return { lat: json.places[0].latitude, long: json.places[0].longitude };
			} else {
				return 'This postal code is incorrect.';
			}
		}
	};

	const sortSearch = async (location) => {
		const searchArea = await getPosition(location).catch((error) =>
			setError(error)
		);
		if (typeof searchArea !== 'string') {
			const filteredArr = allCong.filter((cong) => cong !== null);
			const congArr = filteredArr.map((cong) => {
				const d = distance(
					cong.lat,
					cong.long,
					searchArea.lat,
					searchArea.long
				);

				cong.d = Math.round(d);
				return cong;
			});
			return congArr;
		} else {
			setError(searchArea);
			setLoading(false);
			setSearchResult(null);
		}
	};

	useEffect(() => {
		let isCancelled = false;

		const search = async () => {
			if (location !== '' && !isCancelled) {
				const results = await sortSearch(location).catch((error) =>
					setError(error)
				);
				if (results !== undefined && !isCancelled) {
					setLoading(false);
					setError('');
					const closestResults = results.filter((cong) => cong.d < 100);
					const sorted = closestResults.sort((a, b) => a.d - b.d);
					setSearchResult(sorted);
					setPage(1);
					setSearchTerm('');
					window.scrollTo(0, 0);
				}
			}
		};

		search().catch((error) => console.log(error));

		return () => {
			isCancelled = true;
		};
	}, [location]);

	return {
		searchResult,
		searchTerm,
		setSearchTerm,
		handleSubmit,
		loading,
		error,
		setLoading,
		setSearchResult,
		page,
		setPage,
		location,
		allCong,
		setLocation,
	};
}

export default useSearch;
