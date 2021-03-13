import { useState } from 'react';
import { Header, Card, Faq, Key, Search } from './components';
import useSearch from './hooks/useSearch';

function App() {
	const {
		searchResult,
		searchTerm,
		setSearchTerm,
		searchRef,
		handleSubmit,
		loading,
		error,
		setLoading,
		setSearchResult,
		page,
		setPage
	} = useSearch();

	const [info, setInfo] = useState(0);
	

	const instructions =
		'Please enter a 5 digit U.S. Zip Code, or the first 3 digits of a Canadian postal code.';

	const loadingMessage = 'Loading...';

	const display =
		searchResult !== null &&
		searchResult
			.slice(0, 38)
			.map((cong) => <Card key={cong.id} props={cong} />);

	const displayResults = (pageNum, results) => {
		if (pageNum === 1 && results !== null) {
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
		setPage(num)
		window.scrollTo(0, 225)
	}

	return (
		<>
			<Header props={{ setInfo, setLoading, setSearchResult, setSearchTerm }} />
			<Search props={{ searchTerm, setSearchTerm, searchRef, handleSubmit }} />
			<p className="message">
				{loading
					? loadingMessage
					: error
					? error
					: !searchResult
					? instructions
					: null}
			</p>
			{searchResult && (
				<div className='pageNumbers'>
					<p className={page === 1 ? 'pg accent' : 'pg'} onClick={() => changePage(1)}>1</p>
					<p className={page === 2 ? 'pg accent' : 'pg'} onClick={() => changePage(2)}>2</p>
					<p className={page === 3 ? 'pg accent' : 'pg'} onClick={() => changePage(3)}>3</p>
				</div>
			)}
			<main>{displayResults(page, searchResult)}</main>
			{searchResult && (
				<div className='pageNumbers'>
					<p className={page === 1 ? 'pg accent' : 'pg'} onClick={() => changePage(1)}>1</p>
					<p className={page === 2 ? 'pg accent' : 'pg'} onClick={() => changePage(2)}>2</p>
					<p className={page === 3 ? 'pg accent' : 'pg'} onClick={() => changePage(3)}>3</p>
				</div>
			)}
			{info === 1 ? (
				<Faq props={{ setInfo }} />
			) : info === 2 ? (
				<Key props={{ setInfo }} />
			) : null}
		</>
	);
}

export default App;
