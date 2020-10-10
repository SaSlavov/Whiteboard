import React, { useState, useContext, useEffect } from 'react';
import io from 'socket.io-client';
import { BASE_URL } from '../../../common/constants';
import AuthContext from '../../../providers/AuthContext';
import './AllUsers.css'


const AllUsers = React.memo(({ setChatRoom, setIsChatVisible, history, setReceiver }) => {
    const [usersOnline, setUsersOnline] = useState([])
    const { user } = useContext(AuthContext)
    const [room, setRoom] = useState(null)

    if (!user) {
        history.push("/login")
    };

    let socket = io.connect('http://localhost:4002/online_users');
    socket.emit('all-users-to-server');
    useEffect(() => {
        socket.on('all-users-to-client', data => {
            const filtered = data.filter(currentUser => currentUser.id !== user.id)
            setUsersOnline(filtered);
        });
    }, [])

    const getRoom = (receiver) => {

        fetch(`${BASE_URL}/room/sender/${user.id}/receiver/${receiver.id} `, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(r => r.json())
            .then(result => {
                if (result.error) {
                    throw new Error(result.message);
                }
                setRoom(result[0].id)
                setChatRoom(result[0].id)
                setReceiver(receiver.username)
                setIsChatVisible(true)
            })
            .catch(error => console.error(error.message));
    };

    return (
        <div className="users-online">
            {usersOnline.map((user) => {
                return <div className="user-container" key={user.id} onClick={() => getRoom(user)}>
                    <div className="user-online-username">{user.username}</div>
                </div>
            })}

        </div>
    )
});

export default AllUsers;

