import React from 'react';

function Card({ props }) {
	const isEmail =
		props.email === null || props.email === undefined || props.email === ''
			? false
			: true;
	const isWebsite =
		props.website === null ||
		props.website === undefined ||
		props.website === ''
			? false
			: true;
	const isPastor =
		props.pastor === null || props.pastor === undefined || props.pastor === ''
			? false
			: true;
    const isPhone =
        props.phone === null || props.phone === undefined || props.phone === ''
            ? false
            : true

	return (
		<div className="card">
			<p className="denom">{props.denom}</p>
			<h2>{props.name}</h2>
			<div className="card-info">
				{isPastor && <p>{props.pastor.includes('Contact:') ? props.pastor : `Pastor: ${props.pastor}`}</p>}
				{isPhone && <p>Phone: {props.phone}</p>}
				<p>{props.address}</p>
			</div>
			<div className="card-btns">
				{isEmail ? (
					<a className="btn" href={`mailto:${props.email}`}>
						Email
					</a>
				) : (
					<a className="btn disabled">Email</a>
				)}

				{isWebsite ? <a
					className="btn"
					href={props.website}
					target="_blank"
				>
					Website
				</a> : <a
					className="btn disabled"
				>
					Website
				</a>}
            </div>
			<p className="updated">{props.date}   Distance: {Math.round(props.d)} miles.</p>
		</div>
	);
}

export default Card;
