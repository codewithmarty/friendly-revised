import React, { useEffect, useState } from 'react'
import axios from 'axios'

import ProfileData from '../../components/ProfileData/ProfileData'
import ProfileForm from '../../components/ProfileForm/ProfileForm'
import Conversation from '../../components/Conversation/Conversation'

import './Profile.css'

const Profile = ({ user, setUserInState, conversations, setConversations }) => {

    const [file, setFile] = useState(null)
    const [friendRequests, setFriendRequests] = useState([])

    const handleChange = (evt) => {
        setFile(evt.target.files[0])
    }

    const handleUploadImage = async () => {
        if (file) {
            const token = localStorage.getItem('token')
            const data = new FormData()
            data.append('file', file)
            const res = await axios.put(`/api/users/${user._id}/uploadImage`, data, {
                headers: {
                  "Content-Type": "multipart/form-data",
                  "Authorization": `Bearer ${token}`
                }
            })
            setUserInState(res.data)
        }
    }

    const handleAcceptRequest = async (request) => {
        const res = await axios.put(`/api/friendships/update`, { user: user._id, friend: request._id })
        setFriendRequests(res.data)
        setConversations([...conversations, request])
    }

    useEffect(() => {
        async function fetchFriendRequests() {
            const res = await axios.get(`/api/friendships/${user._id}`)
            setFriendRequests(res.data)
        }
        fetchFriendRequests()
    }, [])

    return (
        
        <div className='profileIndex'>

            { user.imageUrl && user.bio ? 
                <>
                    <div>
                        <h2 className="profileName">{user.name}</h2>
                        <div className="photoUpload"> 
                            <img className="profileImg" src={user.imageUrl} alt="" />
                            <br />
                            <input onChange={handleChange} type="file" id="myFile" accept="image/*" />
                            <button className='confirmBtn' onClick={handleUploadImage}>Upload</button>
                        </div>
                    </div>
                    <ProfileData user={user} setUserInState={setUserInState} />
                </>
            : 
                <div className="profileFormWrap">
                    <ProfileForm className="photoUploadForm" user={user} setUserInState={setUserInState} />
                </div>
            }
            <div>
                <h2>Friend Requests</h2>
                { friendRequests.length ? 
                    <>
                        { friendRequests.map( r => (
                            <div className="card" key={r._id} >
                                <img src={r.imageUrl} alt="" className="card-img" />
                                <div className="card-content">
                                    <h2 className="card-title">{r.name}</h2>
                                    <p className="card-text">{r.bio.substring(0, 25)+'...'}</p>
                                    <button className="card-btn" onClick={() => handleAcceptRequest(r)}>Accept</button>
                                </div>
                            </div>
                        ))}
                    </> 
                    : 
                    <p><br/>...no friend requests</p>}
            </div>
            <div className="friends">
                <h2>Friends</h2><br />
                <div>
                    {conversations && conversations.map((conv, idx) => (
                        <Conversation key={idx} current={false} conversation={conv} />
                    ))}
                </div>
            </div>
        </div>

    )

}

export default Profile