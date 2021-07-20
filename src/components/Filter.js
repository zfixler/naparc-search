import React, { useState, useRef, useEffect } from 'react';

function Filter({ denomFilter, setDenomFilter }) {
	const [isOpen, setIsOpen] = useState(false);
    const filterRef = useRef(null)
   
	const handleChange = (e) => {
		const { name, checked } = e.target;

		setDenomFilter((prevState) => {
			return {
				...prevState,
				[name]: checked,
			};
		});
	};

    useEffect(() => {
        document.addEventListener("click", outsideClick);
        return () => document.removeEventListener("click", outsideClick)

        function outsideClick(e){
            if(filterRef && filterRef.current){
                const ref = filterRef.current
                if(!ref.contains(e.target)){
                    setIsOpen(false)
                }
            }
        }
    }, [isOpen])

	return (
		<div className="filter" ref={filterRef}>
			<button
				className={isOpen ? "btn btn-open" : "btn"}
				onClick={(e) => {
					setIsOpen(!isOpen);
					e.target.blur();
				}}
			>
				{isOpen ? '- Filter Results' :  '+ Filter Results'}
			</button>
			<div className={isOpen === false ? 'closed' : 'filter-menu'} >
				<label htmlFor="HRC">
					<input
						type="checkbox"
						name="HRC"
						checked={denomFilter.HRC}
						onChange={(e) => handleChange(e)}
					/>
					HRC
				</label>
				<label htmlFor="OPC">
					<input
						type="checkbox"
						name="OPC"
						checked={denomFilter.OPC}
						onChange={(e) => handleChange(e)}
					/>
					OPC
				</label>
				<label htmlFor="PRC">
					<input
						type="checkbox"
						name="PRC"
						checked={denomFilter.PRC}
						onChange={(e) => handleChange(e)}
					/>
					PRC
				</label>
				<label htmlFor="RPCNA">
					<input
						type="checkbox"
						name="RPCNA"
						checked={denomFilter.RPCNA}
						onChange={(e) => handleChange(e)}
					/>
					RPCNA
				</label>
				<label htmlFor="URCNA">
					<input
						type="checkbox"
						name="URCNA"
						checked={denomFilter.URCNA}
						onChange={(e) => handleChange(e)}
					/>
					URCNA
				</label>
				<label htmlFor="ARP">
					<input
						type="checkbox"
						name="ARP"
						checked={denomFilter.ARP}
						onChange={(e) => handleChange(e)}
					/>
					ARP
				</label>
				<label htmlFor="PCA">
					<input
						type="checkbox"
						name="PCA"
						checked={denomFilter.PCA}
						onChange={(e) => handleChange(e)}
					/>
					PCA
				</label>
				<label htmlFor="FRCNA">
					<input
						type="checkbox"
						name="FRCNA"
						checked={denomFilter.FRCNA}
						onChange={(e) => handleChange(e)}
					/>
					FRCNA
				</label>
				<label htmlFor="RCUS">
					<input
						type="checkbox"
						name="RCUS"
						checked={denomFilter.RCUS}
						onChange={(e) => handleChange(e)}
					/>
					RCUS
				</label>
			</div>
		</div>
	);
}

export default Filter
