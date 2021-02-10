import { useState, useEffect } from 'react';
import rpcna from './api/rpcna.json';
import Header from './components/Header';
import Search from './components/Search';
import Card from './components/Card';


function App() {
	const [searchTerm, setSearchTerm] = useState('');
	const [allCong, setAllCong] = useState([]);

	useEffect(() => {
		setAllCong(rpcna);
	}, []);

	const display = allCong.map((cong) => <Card key={cong.id} props={cong} />);

	console.log(searchTerm);

	return (
		<>
			<Header />
			<Search props={({ searchTerm }, { setSearchTerm })} />
			<main>{display}</main>
		</>
	);
}

export default App;
