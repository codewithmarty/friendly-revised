import React, { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import axios from 'axios'

import Profile from '../Profile/Profile'
import AuthPage from '../AuthPage/AuthPage'
import Navbar from '../../components/Navbar/Navbar'
import DecisionPage from '../DecisionPage/DecisionPage';

import './App.css'
import Messenger from '../Messenger/Messenger'

const App = () => {

  const [state, setState] = useState({
    user: null
  })

  const [conversations, setConversations] = useState([])

  useEffect(() => {
    async function fetchUser() {

      let token = localStorage.getItem('token')

      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]))
        let userDoc = payload.user
        const user = await axios.get(`/api/users/${userDoc.email}`)
        setState({ ...state, user: user.data })      
      }
    }

    fetchUser()
  }, [])

  useEffect(() => {

    const getConversations = async () => {

        try {

            let fetchConversationDataResponse = await fetch('/api/friendships/chats/'+state.user._id)
            if (!fetchConversationDataResponse.ok) throw new Error("Couldn't fetch conversations")
            let conversationsData = await fetchConversationDataResponse.json()
            setConversations(conversationsData)

        } catch (err) {
            console.log(err)
        }
    }

    if (state.user) getConversations()

  },[state.user])

  const handleLogOut = () => {
    localStorage.removeItem('token');
    setState({ ...state, user: null })      
  }

  const setUserInState = (userData) => {
    setState({ ...state, user: userData })
  }

  return (
    <div className="App">
      <Navbar handleLogOut={handleLogOut} user={state.user} />
      { state.user ? 
        <Routes>
          <Route path={'/profile'} element={<Profile user={state.user} setUserInState={setUserInState} conversations={conversations} setConversations={setConversations} />} />
          <Route path={'/messenger'} element={<Messenger user={state.user} conversations={conversations} />} />
          <Route path={'/'} element={<DecisionPage user={state.user} />} />
        </Routes>
      :
        <AuthPage setUserInState={setUserInState} />
      }
    </div>
  );
}

export default App;
