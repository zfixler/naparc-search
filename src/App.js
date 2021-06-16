import { useState, useEffect, useRef } from 'react';
import {
	Header,
	Card,
	Faq,
	Key,
	Search,
	PageNumbers,
	Footer,
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

	const display =
		searchResult !== null &&
		searchResult
			.slice(0, 38)
			.map((cong) => <Card key={cong.id} props={{ cong, setInfo, page }} />);

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
		<>
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
			<p className="message">
				{loading
					? loadingMessage
					: error
					? error
					: !searchResult
					? instructions
					: `Showing the results for: ${location}.`}
			</p>

			{searchResult && (
				<PageNumbers props={{ page, changePage, searchResult }} />
			)}

			<main>{displayResults(page, searchResult)}</main>

			{searchResult && (
				<PageNumbers props={{ page, changePage, searchResult }} />
			)}

			{info === 1 ? (
				<Faq props={{ setInfo }} />
			) : info === 2 ? (
				<Key props={{ setInfo, info }} />
			) : null}
			<Footer />
		</>
	);
}

export default App;
