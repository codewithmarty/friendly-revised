import React from 'react'

import moment from 'moment'

import "./Message.css"


const Message = ({ message, own }) => {
    return (
        <div className={own ? "message own" : "message"}>
            <div className="messageTop">
                <p className="messageText">{message.text}</p>
            </div>
            <div className="messageBottom">{moment(message.createdAt).fromNow()}</div>
        </div>
    )
}

export default Message