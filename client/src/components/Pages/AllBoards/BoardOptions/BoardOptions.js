import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../../../common/constants';
import { extractUser } from '../../../../providers/AuthContext';
import './BoardOptions.css';


const BoardOptions = ({ toggleOptions, boardInfo, setAreBoardOptionsVisible }) => {
    const [allUsers, setAllUsers] = useState(null)
    const [areUsersVisible, setUsersVisible] = useState(false)
    const [checked, setChecked] = useState(0);
    const loggedUser = extractUser()

    const deleteBoard = () => {
        fetch(`${BASE_URL}/boards/${boardInfo.id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`
            },
        })
            .catch(err => console.log(err.message))
        setAreBoardOptionsVisible(false);
    };


    const isUserInvited = (user) => {
        return user.boardsInvitations.some(board => board.id === boardInfo.id);
    }

    const getUsers = () => {
        fetch(`${BASE_URL}/users`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`
            },
        })
            .then(res => res.json())
            .then(res => {
                setAllUsers(res.filter(user => loggedUser.id !== user.id))
            })
            .catch(err => console.log(err.message))
    }

    const shareBoard = (user) => {
        const isInvited = isUserInvited(user);

        fetch(`${BASE_URL}/users/${user.id}/invite/${boardInfo.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`
            },
            body: JSON.stringify({ isInvited: isInvited })
        })
            .then(res => res.json())
            .then(res => {

                getUsers();
            })
            .catch(err => console.log(err.message))
        setChecked(Math.random())
    }


    useEffect(() => {
        getUsers()
    }, [])

    return (
        <div className="board-options">
            <div className="options-header">
                {<h2 className="info-sign">{`Board topic: ${boardInfo.topic}`}</h2>}
                {<h2 className="info-sign">{`Board author: ${boardInfo.author}`}</h2>}
            </div>
            <div className="options-btn">
                <a className="delete-board-btn" onClick={deleteBoard}><svg height="30" width="30" viewBox="-57 50 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M156.371 30.906h85.57v14.399h30.903V28.89C272.848 12.96 259.894 0 243.973 0H154.34c-15.922 0-28.875 12.96-28.875 28.89v16.415h30.906zm0 0M344.21 167.75H54.103c-7.95 0-14.207 6.781-13.567 14.707L64.79 482.363C66.141 499.105 80.105 512 96.883 512h204.543c16.777 0 30.742-12.895 32.094-29.64l24.253-299.903c.645-7.926-5.613-14.707-13.562-14.707zM124.349 480.012c-.325.02-.649.031-.97.031-8.1 0-14.901-6.309-15.405-14.504l-15.2-246.207c-.523-8.52 5.957-15.852 14.473-16.375 8.488-.516 15.852 5.95 16.375 14.473l15.195 246.207c.528 8.52-5.953 15.847-14.468 16.375zm90.433-15.422c0 8.531-6.918 15.45-15.453 15.45s-15.453-6.919-15.453-15.45V218.379c0-8.535 6.918-15.453 15.453-15.453 8.531 0 15.453 6.918 15.453 15.453zm90.758-245.3l-14.512 246.206c-.48 8.211-7.293 14.543-15.41 14.543-.304 0-.613-.008-.922-.023-8.52-.504-15.02-7.817-14.515-16.336l14.508-246.211c.5-8.52 7.789-15.02 16.332-14.516 8.52.5 15.02 7.817 14.52 16.336zm0 0M397.648 120.063L387.5 89.64a19.65 19.65 0 00-18.64-13.43H29.45a19.646 19.646 0 00-18.637 13.43L.664 120.062c-1.957 5.868.59 11.852 5.344 14.836a12.624 12.624 0 006.75 1.946h372.797c2.52 0 4.816-.73 6.75-1.95 4.754-2.984 7.3-8.968 5.343-14.832zm0 0" /></svg></a>
                <a className="close-options-btn" onClick={() => toggleOptions()}><svg height="45" width="45" xmlns="http://www.w3.org/2000/svg" viewBox="0 -22 75 75"><path d="M44.373 7.603c-10.137-10.137-26.632-10.138-36.77 0-10.138 10.138-10.137 26.632 0 36.77s26.632 10.138 36.77 0c10.137-10.138 10.137-26.633 0-36.77zm-8.132 28.638a2 2 0 01-2.828 0l-7.425-7.425-7.778 7.778a2 2 0 11-2.828-2.828l7.778-7.778-7.425-7.425a2 2 0 112.828-2.828l7.425 7.425 7.071-7.071a2 2 0 112.828 2.828l-7.071 7.071 7.425 7.425a2 2 0 010 2.828z" /></svg></a>
            </div>
                <button className="getUsers-btn" onClick={() => setUsersVisible(areUsersVisible ? false : true)}>Share</button>
            { areUsersVisible &&
                <div className="users-to-share">{allUsers.map(user => {
                    return (
                        <>
                            <div
                                className="user-to-share"
                                key={user.id}>
                                {user.username}
                            </div>
                            <input type="checkbox" checked={isUserInvited(user)} onChange={e => shareBoard(user)}></input>
                        </>
                    )
                })}
                </div>}
        </div>
    );
};

export default BoardOptions;