import React, { useEffect, useState } from 'react'
import axios from 'axios'

import ProfileData from '../../components/ProfileData/ProfileData'
import ProfileForm from '../../components/ProfileForm/ProfileForm'

import './Profile.css'

const Profile = ({ user, setUserInState}) => {

    const [file, setFile] = useState(null)
    const [toggle, setToggle] = useState(false)
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
            <div>
                <h2 className="profileName">{user.name}</h2>
                <button className="showBtn" onClick = {() => setToggle(!toggle)}>Friend List</button>
                <div className={!toggle ? 'hidden' : undefined }>
                    {user.friends ? user.friends.map(friend => 
                        <div className="friendList" key={friend._id}>
                            <img className="profileImage" src={friend.imageUrl} alt="" />
                            <p className="friendName">{friend.name}<button className="xDelete">X</button></p>
                        </div>
                    ) : <>No friends yet!</>}
                    <button className="hideBtn" onClick = { () => setToggle(!toggle) }>Hide Friends</button> 
                </div>

                { user.imageUrl && user.bio ? 
                    <>
                        <div className="photoUpload"> 
                            <img className="profileImg" src={user.imageUrl} alt="" />
                            <br />
                            <input onChange={handleChange} type="file" id="myFile" accept="image/*" />
                            <button className='confirmBtn' onClick={handleUploadImage}>Upload</button>
                            <ProfileData user={user} setUserInState={setUserInState} />
                        </div>
                    </>
                : 
                    <div className="profileFormWrap">
                        <ProfileForm className="photoUploadForm" user={user} setUserInState={setUserInState} />
                    </div>
                }
            </div>
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
        </div>

    )

}

export default Profile