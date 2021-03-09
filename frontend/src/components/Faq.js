import React from 'react'

const Faq = ({props}) => {
    const {setInfo} = props

    return (
        <div className="info-container">
            <div className="info-wrapper">
                <i class="ri-close-circle-line ri-2x close-btn"
                   onClick={() => setInfo(0)}
                   tabIndex={4}
                   onKeyPress={e => {
                    if (e.key === 'Enter') {
                        setInfo(0)
                      }
                   }}></i>

                <h3>What is NAPARC?</h3>
                <p>NAPARC stands for the North American Presbyterian and Reformed Council. You may visit their official website <a href="https://naparc.org" target="_blank" nonref="nonreferrer">here.</a></p>

                <h3>How many denominations are included in NAPARC?</h3>
                <p>There are currently <a href="https://www.naparc.org/directories-2/" target="_blank" nonref="nonreferrer">13 denominations</a> within NAPARC, although all of them are not currently including in this search. Check the denomination key to see the current denominations, and check back with us soon. More will be included shortly!</p>
            </div>
        </div>
    )
}

export default Faq
