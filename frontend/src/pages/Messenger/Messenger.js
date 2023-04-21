import React, { useState, useEffect, useRef } from 'react'
import axios from "axios";
import {io} from "socket.io-client";

import Conversation from "../../components/Conversation/Conversation"
import Message from "../../components/Message/Message"
import Carousel from '../../components/Carousel/Carousel';

import "./Messenger.css"

const Messenger = ({ user, conversations }) => {

    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [arrivalMessage, setArrivalMessage] = useState(null)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const socket = useRef()
    const scrollRef = useRef()

    const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };
    
      useEffect(() => {
        window.addEventListener("resize", handleResize);
    
        return () => {
          window.removeEventListener("resize", handleResize);
        };
      }, []);

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

        arrivalMessage &&
        setMessages( prev => [...prev, arrivalMessage] )

    }, [arrivalMessage, currentChat])

    useEffect( () => {

        socket.current.emit("send-user", user._id)

    }, [user])

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

        if (currentChat) getMessages()

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
            {/* <h1>{windowWidth}</h1>  */}

                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        <br /><h2>Friends</h2><br />
                        {conversations.map((conv, idx) => (
                            <div key={idx} onClick={() => setCurrentChat(conv)}>
                                { windowWidth >= 840 ?
                                    <Conversation current={currentChat && currentChat._id === conv._id} conversation={conv} />
                                :
                                    <>
                                        <Carousel current={currentChat && currentChat._id === conv._id} images={conversations.map( (conv) => conv.imageUrl )}/><br />                          
                                    </>
                                }
                            </div>
                        ))}
                    </div>
                </div>
            
            <div className="chatBox"> 
                <div className="chatBoxWrapper">
                    {currentChat ?
                        <>
                            <div className="chatBoxTop">
                                { messages.map((m, idx)=>(
                                    <div key={idx} ref={scrollRef}>
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