import React from 'react';

function Card({ props }) {
	const { cong, setInfo, page } = props;
	const isEmail =
		cong.email === null || cong.email === undefined || cong.email === ''
			? false
			: true;
	const isWebsite =
		cong.website === null || cong.website === undefined || cong.website === ''
			? false
			: true;
	const isPastor =
		cong.pastor === null ||
		cong.pastor === undefined ||
		cong.pastor === '' ||
		cong.pastor === 'Email:'
			? false
			: true;
	const isPhone =
		cong.phone === null || cong.phone === undefined || cong.phone === ''
			? false
			: true;

	return (
		<div className={'card'}>
			<p className="denom" onClick={() => setInfo(2)}>
				{cong.denom}
			</p>
			<h2>{cong.name}</h2>
			<div className="card-info">
				{isPastor && (
					<p>
						{cong.pastor.includes('Contact:') ? (
							<p>
								<span className="bold">Contact:</span>{' '}
								{cong.pastor.replace(/Contact:/, '')}
							</p>
						) : (
							<p>
								<span className="bold">Pastor:</span> {cong.pastor}
							</p>
						)}
					</p>
				)}
				{isPhone && (
					<p>
						<span className="bold">Phone:</span> {cong.phone}
					</p>
				)}
				<p>
					<span className="bold">Address:</span> {cong.address}
				</p>
			</div>
			<div className="card-btns">
				{isEmail ? (
					<a className="btn" href={`mailto:${cong.email}`}>
						Email
					</a>
				) : (
					<a className="btn disabled">Email</a>
				)}

				{isWebsite ? (
					<a className="btn" href={cong.website} target="_blank">
						Website
					</a>
				) : (
					<a className="btn disabled">Website</a>
				)}
			</div>
			<div className="info-pane">
				<p className="distance">Distance: {Math.round(cong.d)} miles.</p>
			</div>
		</div>
	);
}

export default Card;
