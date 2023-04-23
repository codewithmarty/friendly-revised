import React from 'react'

const Conversation = ({ current, conversation }) => {

    let className = current ? "conversation active" : "conversation"
    return (
        <div className={className}>
            <img className="conversationImg" src={conversation.imageUrl} alt="" />
            <span className="conversationName">{conversation.name.substring(0, 10)+'...'}</span>
        </div>
    )

}

export default Conversation