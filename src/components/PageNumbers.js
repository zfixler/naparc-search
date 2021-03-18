import React from 'react';

const PageNumbers = ({props}) => {
	const { page, changePage, searchResult } = props;

	return (
		<div className="pageNumbers">
			<p
				className={page === 1 ? 'pg accent' : 'pg'}
				style={searchResult.length === 0 ? {display: 'none'} : {display: 'block'}}
				onClick={() => changePage(1)}
			>
				1
			</p>
			<p
				className={page === 2 ? 'pg accent' : 'pg'}
				style={searchResult.length <= 12 ? {display: 'none'} : {display: 'block'}}
				onClick={() => changePage(2)}
			>
				2
			</p>
			<p
				className={page === 3 ? 'pg accent' : 'pg'}
				style={searchResult.length <= 24 ? {display: 'none'} : {display: 'block'}}
				onClick={() => changePage(3)}
			>
				3
			</p>
		</div>
	);
};

export default PageNumbers;
