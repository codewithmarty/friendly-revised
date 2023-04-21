import React, { useState, useEffect } from 'react'

const Conversation = ({ current, conversation }) => {

    let className = current ? "conversation active" : "conversation"
    return (
        <div className={className}>
            <img className="conversationImg" src={conversation.imageUrl} alt="" />
            <span className="conversationName">{conversation.name}</span>
        </div>
    )

}

export default Conversation