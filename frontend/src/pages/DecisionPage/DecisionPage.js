import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

import "./DecisionPage.css"

const DecisionPage = ({ user }) => {

    const [state, setState] = useState({
        allUsers: [],
        isEnabled: true,
        currentProfile: {},
        likedUsers: [],
        dislikedUsers: [],
        index: 0,
    })
    
    const getUsers = async () => {
      let jwt = localStorage.getItem('token')
      let fetchUsersDataResponse = await fetch('/api/friendships', {headers: {'Authorization': 'Bearer ' + jwt}})
      if (!fetchUsersDataResponse.ok) throw new Error("Couldn't fetch users")
      let allUsers = await fetchUsersDataResponse.json()
      setState({...state, allUsers: allUsers, currentProfile: allUsers[0] })
    }

    const handleFriendRequest = (incoming_friend_id) => {
      axios.post('/api/friendships', {
        senderId: user._id,
        receiverId: incoming_friend_id
      }).then(res => {
        setState({ ...state, allUsers: res.data })
      })
    }

    const getCurrentProfile = (index) => {
      setState({ ...state, currentProfile:  state.allUsers[index] })
    } 

    const handleYesSwipe = (incomingUser) => {
      let allUsers = state.allUsers;
      allUsers = allUsers.splice(state.index, 1)
      getCurrentProfile(state.index)
      handleFriendRequest(incomingUser._id)
      setState({...state, allUsers: allUsers, likedUsers: [...state.likedUsers, incomingUser]})
    } 
    
    const handleNoSwipe = (incomingUser) => {
      let currentIndex = state.index
      currentIndex++
      getCurrentProfile(currentIndex)
      setState({...state, dislikedUsers: [...state.dislikedUsers, incomingUser], index: currentIndex})
    }

    useEffect(() => {
        getUsers();
    }, [])
  
    return (
        <div className="swipe-form">
                { state.index >= state.allUsers.length ?
                    <h1><br />No More Profiles To Show</h1>
                    :
                <div className="swipe1">
                    { state.isEnabled === true ?
                        <div className="decisionPN">
                                <img className="userPhoto" src={state.currentProfile.imageUrl} alt="" /> 
                                <h1 className="userName">{state.currentProfile.name}</h1>
                                <img className="arrowBtnDown" src="https://media3.giphy.com/media/5QQ6FpAQ0syYLkONPB/giphy.gif?cid=6c09b9525u8liwg9k1uaro2drmuc549h09bwn9zp9x1b5rvo&rid=giphy.gif&ct=s" onClick={() => setState({ ...state, isEnabled: false })} alt="" />
                                <div className="yes-no">
                                    <button className="no" onClick={()=>handleNoSwipe(state.currentProfile)}><FontAwesomeIcon icon={faTimes}/></button>
                                    <button className="yes" onClick={()=>handleYesSwipe(state.currentProfile)}><FontAwesomeIcon icon={faCheck}/></button>
                                </div>
                        </div>
                        :
                        <div>
                          <div className="bioWrapper">
                              <h3 className="userBio">Bio:</h3><p>{state.currentProfile.bio}</p>
                          </div>
                          <h1 className="userInterests">Interests:{state.currentProfile.interests.map((interest, idx) => <button key={idx} className="interestList">{interest.label}</button>)}</h1>
                          <img className="arrowBtnUp" src="https://media3.giphy.com/media/5QQ6FpAQ0syYLkONPB/giphy.gif?cid=6c09b9525u8liwg9k1uaro2drmuc549h09bwn9zp9x1b5rvo&rid=giphy.gif&ct=s" onClick={() => setState({ ...state, isEnabled: true })} alt="" />
                        </div>                  
                    }
                </div>
                }
        </div>
    )
}

export default DecisionPage