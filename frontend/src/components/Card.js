import React from 'react'


function Card({props}) {
    return (
        <div className="card">
            <p className="denom">{props.denom}</p>
            <h2>{props.name}</h2>
            <div className="card-info">
                <p>{props.pastor}</p>
                <p>Phone: {props.phone}</p>
                <p>{props.address}</p>
            </div>
            <div className="card-btns">
                <a className="btn" href={`mailto:${props.email}`}>Email</a>
                <a className="btn" href={props.website}>Website</a>
            </div>
            
        </div>
    )
}

export default Card
