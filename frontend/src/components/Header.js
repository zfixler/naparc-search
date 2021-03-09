import React from 'react'


function Header({props}) {
    const {setInfo} = props
    return (
        <header>
            <h1>NAPARC</h1>
            <p>Search for a Reformed Congregation</p>
            <div className='links'>
                <p className='link' 
                   tabIndex={1} 
                   onClick={() => setInfo(1)}
                   onKeyPress={e => {
                    if (e.key === 'Enter') {
                        setInfo(1)
                      }
                   }}
                   >FAQ</p>

                <p className='link' 
                   tabIndex={2} 
                   onClick={() => setInfo(2)}
                   onKeyPress={e => {
                    if (e.key === 'Enter') {
                        setInfo(1)
                      }
                   }}
                   >Key</p>  
            </div>
        </header>
    )
}

export default Header
