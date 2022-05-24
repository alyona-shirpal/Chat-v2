import React, {useEffect, useState} from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

const Chat = ({socket, username, room}) => {

    const [messageList, setMessageList] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    // const [ isTyping, setTyping ] = useState(false);
    // const [ typingMessage, setTypingMessage] = useState('')


    useEffect(() => {
        socket.on("receive_message", data=> {
            setMessageList((list) => [...list, data]);
        });

    }, [socket]);

    useEffect(() => {
        socket.emit('get-messages-history', room)
        socket.on('output-messages', messages => {
            setMessageList(messages)
        })
    });


    const sendMessage =  () => {
        if (currentMessage !== "") {
            const messageData = {
                author: username,
                message: currentMessage,
                roomName: room,
                time: new Date(Date.now()).getHours() +
                    ":" +
                    new Date(Date.now()).getMinutes()
            };

            socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData])
            setCurrentMessage("");
        }
    };

    // const handleKeyPress = (event) => {
    //     if(event.key){
    //         const typingData = {
    //             message: `${username} is typing `
    //         }
    //         console.log(typingData)
    //         socket.emit('typing', typingData.message)
    //         setTypingMessage(typingData.message)
    //
    //         setTyping(true)
    //
    //         setTimeout(() => {
    //            setTyping(false);
    //         }, 4000);
    //     }
    //
    // }

    return (
        <div className="chat-window">
            <div className="chat-header">
                <p> {room} room</p>
            </div>
            <div className="chat-body">
                <ScrollToBottom className="message-container">
                {messageList.map((messageContent) => {
                    return (
                        <div className="message" id={username === messageContent.author ? "you" : "other"}>
                        <div>
                            <div className="message-content">
                                <p>{messageContent.message} </p>
                            </div>
                            <div className="message-meta">
                                <p id="time">{messageContent.time}</p>
                                <p id="author">{messageContent.author}</p>
                            </div>
                        </div>

                    </div>
                    );
                })}
                    {/*{isTyping === true && <div className="chat-message__typing">*/}
                    {/*    {typingMessage}*/}
                    {/*</div>  }*/}
                </ScrollToBottom>
            </div>
            <div className="chat-footer">
                <input type="text"
                       value={currentMessage}
                       placeholder="Type here .."
                      // onKeyDown={handleKeyPress}
                       onChange={(event) => {
                           setCurrentMessage(event.target.value)
                       }}
                       onKeyPress={(event)=>{
                           event.key === "Enter" && sendMessage()}
                }
                />
                <button onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
    )
}

export default Chat;