import { useState, useEffect, useRef } from 'react';
import {
	Header,
	Card,
	Faq,
	Key,
	Search,
	PageNumbers,
	Footer,
	Filter,
} from './components';
import useSearch from './hooks/useSearch';

function App() {
	const {
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
		setLocation,
	} = useSearch();

	const [info, setInfo] = useState(0);
	const searchRef = useRef(null);
	const [display, setDisplay] = useState(null);
	const [denomFilter, setDenomFilter] = useState({
		PCA: true,
		OPC: true,
		ARP: true,
		RPCNA: true,
		URCNA: true,
		HRC: true,
		PRC: true,
		FRCNA: true,
		RCUS: true
	})

	useEffect(() => {
		searchRef.current.focus();
	}, []);

	const instructions =
		'Please enter a 5 digit U.S. Zip Code, or the first 3 digits of a Canadian postal code.';

	let loadingMessage = 'Loading...';

	useEffect(() => {
		setTimeout(() => {
			if (loading) {
				loadingMessage = 'Something went wrong. Please try again later.';
			}
		}, 5000);
	}, [loading]);

	useEffect(() => {
		let final = null;
		if (searchResult !== null) {
			const filtered = searchResult.filter(cong => denomFilter[`${cong.denom}`] !== false);
			final = filtered
				.slice(0, 38)
				.map((cong) => <Card key={cong.id} props={{ cong, setInfo, page }} />);
		}
		setDisplay(final);
		console.log(display)
	}, [searchResult, denomFilter]);

	const displayResults = (pageNum, results) => {
		if (pageNum === 1 && results !== null) {
			if (results.length === 0) {
				return (
					<p className="message">
						There are no congregations within 100 miles of that location.
					</p>
				);
			}
			return display.slice(0, 12);
		} else if (pageNum === 2 && results !== null) {
			return display.slice(13, 25);
		} else if (pageNum === 3 && results !== null) {
			return display.slice(26, 38);
		} else {
			return null;
		}
	};

	const changePage = (num) => {
		setPage(num);
		window.scrollTo(0, 0);
	};

	return (
		<div className='app-wrapper'>
			<div>
				<Header
					props={{
						setInfo,
						setLoading,
						setSearchResult,
						setSearchTerm,
						searchRef,
						setLocation,
					}}
				/>
				<Search
					props={{ searchTerm, setSearchTerm, searchRef, handleSubmit, setInfo }}
				/>
				<Filter denomFilter={denomFilter} setDenomFilter={setDenomFilter} />
				<p className="message">
					{loading
						? loadingMessage
						: error
						? error
						: !searchResult
						? instructions
						: `Showing the results for: ${location}.`}
				</p>

				{display !== null && (
					<PageNumbers props={{ page, changePage, display }} />
				)}

				<main>{display !== null && displayResults(page, display)}</main>

				{display !== null && (
					<PageNumbers props={{ page, changePage, display }} />
				)}

				{info === 1 ? (
					<Faq props={{ setInfo }} />
				) : info === 2 ? (
					<Key props={{ setInfo, info }} />
				) : null}
			</div>
			<Footer />
		</div>
	);
}

export default App;
