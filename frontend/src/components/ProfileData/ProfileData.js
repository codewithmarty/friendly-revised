import React, { useState } from "react"
import EditProfile from "../EditProfile/EditProfile.js"

import "./ProfileData.css"

const ProfileData = ({ user, setUserInState }) => {

    const [clicked, setClicked] = useState(false)

    return (
        <> 
            { clicked ? 
                <div className="editProfileForm">
                    <EditProfile user={user} setClicked={setClicked} setUserInState={setUserInState} />
                </div>
                :
                <>
                    <div className='bioIndex'>
                        <h2>Bio: </h2>
                        <p className="bioBlock">{user.bio}</p>
                    </div>
                    <div className='interestIndex'>
                        <h2>Interests: </h2>
                        {user.interests ? user.interests.map((interest, idx) => <p key={idx}>{interest.label}</p>) : <>No interests yet</>}
                    </div>
                    <button className="editBtn" onClick={ () => setClicked(true) }>Edit Profile</button>
                </>
            }
        </>
    )     
      
}

export default ProfileData