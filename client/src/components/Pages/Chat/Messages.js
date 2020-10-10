import React from 'react';

const Messages = ({ message, user }) => {
    if (message.sender === user.username) {
        return (
            <div className="myMessage">
                <p>{` ${message.message}`}</p>
            </div>
        )
    } else {
        return (
            <div className="incomingMessage">
                <p>{` ${message.message}`}</p>
            </div>
        )
    }

}

export default Messages;