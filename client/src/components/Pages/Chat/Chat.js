import React, { useState, useContext, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import AuthContext from '../../../providers/AuthContext';
import Messages from './Messages';
import './Messages.css'


const Chat = React.memo(({ roomId, setIsChatVisible, history, chatReceiver }) => {
    let socket;
    const [inputState, setInputState] = useState('')
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState(null)
    const { user } = useContext(AuthContext)
    const [room, setRoom] = useState(null)
    const inputDiv = useRef()
    const messagesDiv = useRef()

    if (!user) {
        history.push("/login")
    };

    socket = io.connect('http://localhost:4001/message');

    useEffect(() => {
        socket.emit('roomId-to-server', { roomId: roomId });
        setRoom(null)
    }, [newMessage])

    useEffect(() => {
        socket.on('new-message-to-client', data => {
            setNewMessage(data)
            messagesDiv.current && (messagesDiv.current.scrollTop = messagesDiv.current.scrollHeight)
        });

        socket.on('all-messages-to-client', data => {
            setMessages(data);
            messagesDiv.current && (messagesDiv.current.scrollTop = messagesDiv.current?.scrollHeight)
        });

    }, [newMessage])



    const emitMessage = (e) => {
        const message = inputState;
        socket.emit('new-message-to-server', { message, sender: user, roomId: roomId });
        setInputState('')
    };

    return (
        <div className="chat">
            <div className="chat-header">
                <h4 className="chat-receiver">{chatReceiver}</h4>
                <a className="close-chat" onClick={() => setIsChatVisible(false)}><svg height="23" width="23" viewBox="0 0 512.001 512.001" xmlns="http://www.w3.org/2000/svg"><path d="M16.035 311.078c-4.097 0-8.195-1.558-11.308-4.695-6.25-6.25-6.25-16.383 0-22.633L283.789 4.687c6.25-6.25 16.383-6.25 22.633 0s6.25 16.383 0 22.637L27.363 306.383a16.045 16.045 0 01-11.328 4.695zm0 0" /><path d="M295.117 311.078a15.879 15.879 0 01-11.308-4.695L4.727 27.324c-6.25-6.254-6.25-16.386 0-22.636s16.382-6.25 22.636 0L306.422 283.75c6.25 6.25 6.25 16.383 0 22.633-3.137 3.117-7.23 4.695-11.305 4.695zm0 0" /></svg></a>
            </div>
            <div className="msg_history" ref={messagesDiv}>
                {messages.map((message) => <Messages key={message.id} message={message} user={user} />)}
            </div>
            <div className="message-input-container">
                <textarea id="message-input" ref={inputDiv} type="text" autoComplete="off" value={inputState} onChange={(e) => setInputState(e.target.value)} onKeyUp={(e) => e.key === 'Enter' && emitMessage(e)} /*contentEditable="true" datavalue={inputState} onKeyPress={(e) =>e.key === 'Enter'? e.target.attributes.datavalue.value = '' : inputMessage(e)}*/ ></textarea>
                <a id="message-button" onClick={() => emitMessage()}><svg height="18" width="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.001 512.001"><path d="M501.44 10.56c-8.86-8.859-21.435-12.449-33.636-9.603l-.168.04L65.557 99.4A85.803 85.803 0 000 182.935V236c0 19.333 15.319 35.156 34.457 35.967L185.7 297.711a10 10 0 008.749-2.787l178.237-178.238c6.249-6.248 16.379-6.248 22.628 0 6.248 6.249 6.248 16.379 0 22.628L217.077 317.552a10 10 0 00-2.787 8.749l25.743 151.243C240.844 496.681 256.667 512 276 512h53.065a85.803 85.803 0 0083.535-65.556l98.402-402.08.04-.168c2.848-12.202-.742-24.776-9.602-33.636z" /></svg></a>
            </div>
        </div>
    )
});

export default Chat;