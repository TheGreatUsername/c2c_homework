import React from "react";
import Avail from './Avail';

export default function AvailList({avails}) {
    return (
        avails.map(avail => {
            return <Avail availobj={avail}/>
        })
    )
}
