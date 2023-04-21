import React, { useState } from 'react';
import Select from 'react-select';

import './ProfileForm.css'

const ProfileForm = ({ user, setUserInState }) => {

    const interestOptions = [
        { label: "Cars", value: 1 },
        { label: "Shoes", value: 2 },
        { label: "Food", value: 3},
        { label: "Netflix", value: 4 },
        { label: "Amazon", value: 5 },
        { label: "Coding", value: 6 }
    ]

    const [state, setState] = useState({
        bio: '',
        interests: []
    })

    const handleSelect = (incomingInterest) => {
        let interests = state.interests
        incomingInterest.map(i => i.label)
        interests.push(incomingInterest[incomingInterest.length-1])
        interests.flat(Infinity)
        setState({ ...state, interests })
    }

    const handleSubmit = async () => {
        try {
          let jwt = localStorage.getItem('token')
            const response = await fetch(`/api/users/profile`, {
                method: "PUT",
                headers: {"Content-Type": "application/json",'Authorization': 'Bearer ' + jwt},
                body: JSON.stringify({ bio: state.bio, interests: state.interests })
            })
            const userDoc = await response.json()
            setUserInState(userDoc)
        } catch (err) {
          console.error("Error:", err) // <-- log if error
        }
    }

    return (
        <div className="profileForm">
            Bio:
            <br />
            <textarea
                className="bioArea"
                rows="5"
                cols="53"
                name="bio"
                onChange={(evt) => setState({ ...state, bio: evt.target.value })}
                placeholder={user.bio}></textarea>
            <br />
            Interests:
            <Select name= "interests" placeholder={user.interests.map((interest, idx) => <li key={idx}>{interest.label}</li>)} onChange={handleSelect} options={ interestOptions } isMulti />
            <button className="submitFormBtn" onClick={handleSubmit}>Submit!</button>
        </div>
    )
}

export default ProfileForm