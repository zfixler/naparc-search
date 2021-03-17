import React from 'react';

const Key = ({ props }) => {
	const { setInfo } = props;

	return (
		<div className="info-container">
			<div className="info-wrapper">
				<i
					class="ri-close-circle-line ri-2x close-btn"
					onClick={() => setInfo(0)}
                    tabIndex={5}
                    onKeyPress={e => {
                        if (e.key === 'Enter') {
                            setInfo(0)
                          }
                       }}
				></i>

                <h3>Denomination Key</h3>
				<p>
					<span className="accent">HRC</span>: Heritage Reformed Congregations
				</p>
				<p>
					<span className="accent">OPC</span>: Orthodox Presbyterian Church
				</p>
				<p>
					<span className="accent">PRC</span>: Presbyterian Reformed Church
				</p>
				<p>
					<span className="accent">RPCNA</span>: Reformed Presbyterian Church in
					North America
				</p>
				<p>
					<span className="accent">URCNA</span>: United Reformed Churches in
					North America
				</p>
				<p>
					<span className="accent">ARP</span>: Associate Reformed Presbyterian Church
				</p>
				<p>
					<span className="accent">PCA</span>: Presbyterian Church in America
				</p>

				<p>More coming soon!</p>
			</div>
		</div>
	);
};

export default Key;
