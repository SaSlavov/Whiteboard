import React, { useContext, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { BASE_URL } from '../../../../common/constants';
import AuthContext from '../../../../providers/AuthContext';
import { LanguageContext } from '../../../../providers/LanguageProvider';
import { ThemeContext } from '../../../../providers/ThemeProvider';
import BoardOptions from '../BoardOptions/BoardOptions';
import './AllBoards.css';


const AllBoards = ({ history, myBoards, sharedBoards }) => {
    const [boards, setBoards] = useState([]);
    const { setLabelsTheme } = useContext(ThemeContext);
    const { setLabels } = useContext(LanguageContext);
    const [areBoardOptionsVisible, setAreBoardOptionsVisible] = useState(false);
    const [boardInfo, setBoardInfo] = useState({});

    const { user } = useContext(AuthContext);

    if (!user) {
        history.push("/login")
    };
    
    const loadBoards = () => {
        fetch(`${BASE_URL}/boards${myBoards ? '/my_boards' : (sharedBoards ? '/shared_boards' : '')}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
            },
        })
            .then(r => r.json())
            .then(res => {
                setBoards(res);
            })
    };

    useEffect(() => {
        loadBoards();
    }, [areBoardOptionsVisible]);

    const toggleOptions = (boardToEdit) => {
        setBoardInfo(boardToEdit);
        setAreBoardOptionsVisible(areBoardOptionsVisible ? false : true);
        loadBoards();
    };

    return (
        <div>
            {areBoardOptionsVisible ?
                <BoardOptions toggleOptions={toggleOptions} boardInfo={boardInfo} setAreBoardOptionsVisible={setAreBoardOptionsVisible} />
                : <div>
                    <br /><br /><br />
                    <div className="all-boards">
                        {
                            boards.map((singleBoard) => <div
                                className='every-board'
                                key={singleBoard.id}>
                                <div>
                                    <div>
                                        {setLabels('author')}: {singleBoard.author}
                                    </div>
                                    <div>
                                        {setLabels('topic')}: {singleBoard.topic}
                                    </div>
                                    <a className="options-button" onClick={() => toggleOptions(singleBoard)}><svg height="30" width="30" xmlns="http://www.w3.org/2000/svg" viewBox="2 -66 512 512"><path d="M193 190.131c-34.762 0-63.043 28.281-63.043 63.043s28.281 63.043 63.043 63.043 63.043-28.281 63.043-63.043-28.281-63.043-63.043-63.043zm0 108.086c-24.837 0-45.043-20.207-45.043-45.043s20.207-45.043 45.043-45.043 45.043 20.206 45.043 45.043-20.206 45.043-45.043 45.043z" /><path d="M193 161.854c-50.354 0-91.32 40.966-91.32 91.32s40.966 91.32 91.32 91.32 91.32-40.966 91.32-91.32-40.966-91.32-91.32-91.32zm0 164.64c-40.429 0-73.32-32.891-73.32-73.32 0-40.429 32.892-73.32 73.32-73.32s73.32 32.891 73.32 73.32c0 40.429-32.891 73.32-73.32 73.32z" /><path d="M438.665 108.341h-20.06a118.444 118.444 0 00-7.876-19.005l14.19-14.19a9 9 0 000-12.728l-38.18-38.18a9 9 0 00-12.728 0L359.818 38.43a118.71 118.71 0 00-18.993-7.876V10.491a9 9 0 00-9-9h-54a9 9 0 00-9 9v20.061a118.786 118.786 0 00-19.003 7.878l-14.193-14.192a9 9 0 00-12.728 0l-35.937 35.937h-20.596a9 9 0 00-9 9v23.942a163.583 163.583 0 00-13.546 3.616l-11.964-20.722a9 9 0 00-12.295-3.294L73.436 99.346a9 9 0 00-3.294 12.295l11.989 20.765a165.64 165.64 0 00-9.899 9.899l-20.765-11.989a9.002 9.002 0 00-12.295 3.294l-26.631 46.127a9 9 0 003.294 12.294l20.722 11.964a164 164 0 00-3.616 13.547H9a9 9 0 00-9 9v53.263a9 9 0 009 9h23.941a164 164 0 003.616 13.547l-20.722 11.963a9 9 0 00-3.294 12.295l26.631 46.127a9 9 0 0012.294 3.294l20.765-11.988a165.64 165.64 0 009.899 9.899l-11.989 20.765a9.002 9.002 0 003.294 12.295l46.127 26.631a9 9 0 0012.294-3.294l11.963-20.722a163.317 163.317 0 0013.547 3.616v23.941a9 9 0 009 9h53.263a9 9 0 009-9v-23.941a164 164 0 0013.547-3.616l11.963 20.722c2.487 4.305 7.991 5.779 12.294 3.294l46.127-26.631a9 9 0 003.294-12.295l-11.989-20.765a165.64 165.64 0 009.899-9.899l20.765 11.988a8.999 8.999 0 0012.294-3.294l26.631-46.127a8.998 8.998 0 00-3.294-12.295l-20.722-11.963a164 164 0 003.616-13.547H377a9 9 0 009-9V265.1c.256-.205.505-.422.739-.656l38.18-38.19a9 9 0 00-.001-12.727l-14.188-14.189a118.363 118.363 0 007.874-18.998h20.061a9 9 0 009-9v-54a9 9 0 00-9-8.999zM368 270.805h-22.337a9 9 0 00-8.868 7.463 145.312 145.312 0 01-6.699 25.091 9 9 0 003.951 10.889l19.323 11.156-17.632 30.539-19.364-11.18a9.004 9.004 0 00-11.402 2.018 147.23 147.23 0 01-18.365 18.365 9 9 0 00-2.018 11.402l11.18 19.364-30.539 17.631-11.156-19.322a9 9 0 00-10.889-3.951 145.257 145.257 0 01-25.09 6.698 9.001 9.001 0 00-7.464 8.868v22.337h-35.263v-22.337a9 9 0 00-7.464-8.868c-8.558-1.482-17-3.736-25.09-6.698a9 9 0 00-10.889 3.951l-11.156 19.322-30.539-17.631 11.18-19.364a9 9 0 00-2.018-11.402 147.23 147.23 0 01-18.365-18.365 9 9 0 00-11.402-2.018l-19.364 11.18-17.631-30.538 19.322-11.156a9.001 9.001 0 003.951-10.889 145.257 145.257 0 01-6.698-25.09 9.001 9.001 0 00-8.868-7.464H18v-35.263h22.337a9 9 0 008.868-7.464c1.482-8.559 3.736-17 6.698-25.09a9 9 0 00-3.951-10.889l-19.323-11.156 17.632-30.539 19.364 11.18a9.001 9.001 0 0011.402-2.018 147.298 147.298 0 0118.365-18.365 9 9 0 002.018-11.402l-11.18-19.364 30.539-17.632 11.156 19.322a9 9 0 0010.889 3.952 145.385 145.385 0 0125.091-6.699 9 9 0 007.463-8.868V78.174h35.263v22.337a9 9 0 007.463 8.868 145.337 145.337 0 0125.091 6.699 9.001 9.001 0 0010.889-3.951l11.156-19.322 30.539 17.632-11.18 19.364a9.001 9.001 0 002.018 11.402 147.23 147.23 0 0118.365 18.365 9.002 9.002 0 0011.402 2.018l19.365-11.18 17.631 30.539-19.323 11.156a9.001 9.001 0 00-3.951 10.889 145.288 145.288 0 016.699 25.091 9 9 0 008.868 7.463H368v35.261zm61.665-108.464h-17.86a9 9 0 00-8.728 6.804 100.39 100.39 0 01-11.243 27.121 9 9 0 001.357 10.989l12.637 12.637L386 239.725v-13.182a9 9 0 00-9-9h-23.942a164 164 0 00-3.616-13.547l20.722-11.964a9 9 0 003.294-12.294l-26.631-46.127a9 9 0 00-12.294-3.294l-20.765 11.989a165.05 165.05 0 00-9.899-9.899l11.989-20.765a9.002 9.002 0 00-3.294-12.295l-46.127-26.632a8.997 8.997 0 00-12.295 3.294l-11.964 20.722a163.688 163.688 0 00-13.546-3.616V69.174a9 9 0 00-9-9h-7.211l16.845-16.845 12.636 12.636a8.998 8.998 0 0010.979 1.363A100.819 100.819 0 01280.02 46.08a9 9 0 006.806-8.729v-17.86h36v17.86a9 9 0 006.804 8.728 100.856 100.856 0 0127.13 11.249 8.997 8.997 0 0010.979-1.363l12.636-12.636 25.452 25.452-12.636 12.636a9 9 0 00-1.359 10.985 100.528 100.528 0 0111.244 27.132 9 9 0 008.729 6.806h17.86v36.001z" /></svg></a>
                                    <a className="open-button" onClick={() => history.push(`/drawing_board/${singleBoard.id}`)}><svg height="25" width="25" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M405.332 256.484c-11.797 0-21.332 9.559-21.332 21.332v170.668c0 11.754-9.559 21.332-21.332 21.332H64c-11.777 0-21.332-9.578-21.332-21.332V149.816c0-11.754 9.555-21.332 21.332-21.332h170.668c11.797 0 21.332-9.558 21.332-21.332 0-11.777-9.535-21.336-21.332-21.336H64c-35.285 0-64 28.715-64 64v298.668c0 35.286 28.715 64 64 64h298.668c35.285 0 64-28.714 64-64V277.816c0-11.796-9.54-21.332-21.336-21.332zm0 0" /><path d="M200.02 237.05a10.793 10.793 0 00-2.922 5.438l-15.082 75.438c-.703 3.496.406 7.101 2.922 9.64a10.673 10.673 0 007.554 3.114c.68 0 1.387-.063 2.09-.211l75.414-15.082c2.09-.43 3.988-1.43 5.461-2.926l168.79-168.79-75.415-75.41zm0 0M496.383 16.102c-20.797-20.801-54.633-20.801-75.414 0l-29.524 29.523 75.414 75.414 29.524-29.527C506.453 81.465 512 68.066 512 53.816s-5.547-27.648-15.617-37.714zm0 0" /></svg></a>
                                </div>
                            </div>)
                        }
                    </div>
                </div>}
        </div>
    );
};

export default withRouter(AllBoards);