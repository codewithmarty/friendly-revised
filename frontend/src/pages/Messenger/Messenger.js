import React, { useState, useEffect, useRef } from 'react'
import axios from "axios";
import {io} from "socket.io-client";

import Conversation from "../../components/Conversation/Conversation"
import Message from "../../components/Message/Message"

import "./Messenger.css"

const Messenger = ({ user }) => {

    const [conversations, setConversations] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState(null)
    const [arrivalMessage, setArrivalMessage] = useState(null)

    const socket = useRef()
    const scrollRef = useRef()

    useEffect( () => {

        socket.current = io();

        socket.current.on("get-message", data=>{
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            })
        })

    },[])

    useEffect( () => {

        arrivalMessage && currentChat.members.includes(arrivalMessage.sender) &&
        setMessages( prev => [...prev, arrivalMessage] )

    }, [arrivalMessage, currentChat])

    useEffect( () => {

        socket.current.emit("send-user", user._id)

    }, [user])

    useEffect(() => {

        const getConversations = async () => {

            try {

                let fetchConversationDataResponse = await fetch('/api/friendships/chats/'+user._id)
                if (!fetchConversationDataResponse.ok) throw new Error("Couldn't fetch conversations")
                let conversationsData = await fetchConversationDataResponse.json()
                setConversations(conversationsData)

            } catch (err) {
                console.log(err)
            }
        }

        getConversations()

    },[user._id])

    useEffect(() => {

        const getMessages = async () => {

            try {

                let fetchMessagesDataResponse = await fetch(`/api/friendships/messages/${user._id}/${currentChat._id}`)
                if (!fetchMessagesDataResponse.ok) throw new Error("Couldn't fetch orders")
                let messagesData = await fetchMessagesDataResponse.json() 
                setMessages(messagesData)
                
            } catch(err) {
                console.log(err)
            }
        }

        getMessages()

    }, [currentChat])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const message = {
            senderId: user._id,
            receiverId: currentChat._id,
            text: newMessage,
        };

        socket.current.emit("send-message", {
            senderId: user._id,
            receiverId: currentChat._id,
            text: newMessage,
        })

        try {

            await axios.post("/api/friendships/newMessage", message);
            setMessages([...messages, message]);
            setNewMessage("");

        } catch(err) {
            console.log(err);
        }
    }

    useEffect( () => {

        if ( scrollRef.current ) scrollRef.current.scrollIntoView({ behavior: "smooth" })
    
    },[messages])

    return (
        <div className="messenger">
            <div className="chatMenu">
                <div className="chatMenuWrapper">
                    <h2>Chats</h2>
                    {conversations.map((c) => (
                        <div onClick={() => setCurrentChat(c)}>
                            <Conversation conversation={c} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="chatBox"> 
                <div className="chatBoxWrapper">
                    {currentChat ?
                        <>
                            <div className="chatBoxTop">
                                { messages.map((m)=>(
                                    <div ref={scrollRef}>
                                        <Message message={m} own={m.senderId === user._id}/>
                                    </div>
                                )) }
                            </div>
                            <div className="chatBoxBottom">
                                <textarea className="chatMessageInput" placeholder="Write your message here..." onChange={ (e) => setNewMessage(e.target.value)} value={newMessage}></textarea>
                                <button className="chatSubmitButton" onClick={handleSubmit}>Send</button>
                            
                            </div> 
                        </> : <span className="noConvo">Start a chat</span>
                    }
                </div>
            </div>
        </div>
    )
}

export default Messenger