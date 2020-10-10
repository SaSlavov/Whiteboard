import React, { useContext, useEffect, useState } from 'react';
import './UserProfile.css';
import { BASE_URL } from '../../../common/constants';
import AuthContext, { extractUser } from '../../../providers/AuthContext';
import AllBoards from '../AllBoards/AllBoards/AllBoards';

const UserProfile = (props) => {
    const [files, setFiles] = useState([]);
    const [userInfo, setUserInfo] = useState({});
    const [myBoards, toggleMyBoards] = useState(false);
    const [sharedBoards, toggleSharedBoards] = useState(false);
    // let user = extractUser();

    const { user } = useContext(AuthContext);

    if (!user) {
        props.history.push("/login")
    };

    useEffect(() => {
        fetch(`${BASE_URL}/users/${user?.id}`, {})
            .then(r => r.json())
            .then(info => setUserInfo(info))
            .catch(err => console.log('can\'t get user info', err))
    }, []);

    const uploadAvatar = () => {
        const formData = new FormData();
        if (!files.length) {
            return;
        }

        formData.append('files', files[0])
        fetch(`${BASE_URL}/users/${user.id}/avatar`, {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(console.log)
            .catch(console.warn)
        user = extractUser();
    };

    return (
        <div>
            {(myBoards || sharedBoards)
                ? <AllBoards myBoards={myBoards} sharedBoards={sharedBoards} />
                :
                <div className="user-info-container">
                    <div className="name-avatar">
                        <span className="user-username">{user?.username}</span><br />
                        <img className="user-avatar" src={`${BASE_URL}/avatars/${user?.avatarUrl}`} alt="user avatar"></img>
                    </div>
                    <div className="additional-info">
                        <span className="user-first-name">{`First name : ${userInfo.firstName}`}</span>
                        <span className="user-last-name">{`Last name : ${userInfo.lastName}`}</span>
                        <span className="user-email">{`E-Mail : ${userInfo.email}`}</span>
                        <a className="my-boards" onClick={() => toggleMyBoards(myBoards ? false : true)}>My Boards</a>
                        <a className="shared-boards" onClick={() => toggleSharedBoards(sharedBoards ? false : true)}>Invitations</a>
                    </div>
                    <div className="avatar-upload-form">
                        <label className="file-path-label" htmlFor="file-path">Select avatar:</label>
                        <input className="file-path" type="file" onChange={(e) => setFiles(Array.from(e.target.files))}></input><br /><br />
                        <button className="upload-button" onClick={uploadAvatar} disabled={files.length < 1}>Upload</button>
                    </div>
                </div>}
        </div>
    );
};

export default UserProfile;