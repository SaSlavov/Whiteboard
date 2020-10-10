import React from 'react'
import { BASE_URL } from '../../../common/constants';

const ConfirmAccount = (props) => {
    const id = props.location.pathname.split('/').pop()

    fetch(`${BASE_URL}/users/${id} `, {
        method: 'Put',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(result => {

            if (result.error) {
                console.log(result.message);
            }
        })
        .catch(alert)

    return (
        <h1 style={{ color: "wheat" }}>Thank you for confirming your email! Enjoy your stay!</h1>
    )
}

export default ConfirmAccount;