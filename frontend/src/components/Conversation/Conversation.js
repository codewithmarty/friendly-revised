import React, { useState, useEffect } from 'react'

const Conversation = ({ conversation }) => {

    return (
        <div className="conversation">
            <img className="conversationImg" src={conversation.imageUrl} alt="" />
            <span className="conversationName">{conversation.name}</span>
        </div>
    )

}

export default Conversation