import React from 'react'
import { Link } from 'react-router-dom'

import UserLogOut from '../UserLogOut/UserLogOut'

const Navbar = ({ user, handleLogOut }) => {
  return (
    <nav className="nav-bar-fixed">
        <span className="nav-wrapper">
        
            {user ?
            <>
            <div className="nav-bar">
                    <Link className="home" to='/'><img id="homeLogo" src="https://upload.wikimedia.org/wikipedia/commons/e/ee/Chain_link_icon.png" alt="" /></Link>&nbsp;&nbsp;
                    <Link className="profile" to='/profile'><img id="messengerLogo" src="https://d32ogoqmya1dw8.cloudfront.net/images/serc/empty_user_icon_256.v2.png" alt="" /></Link>&nbsp;&nbsp;
                    <Link className="profile" to='/messenger'><img id="messengerLogo" src="https://static.thenounproject.com/png/1204376-200.png" alt="" /></Link>&nbsp;&nbsp;
            </div>
            <div className="logoutBtn">
                    <UserLogOut className="logout" handleLogOut={handleLogOut}/>
            </div>
            </>
        :
            <>
            </>
        } 
        </span>
    </nav>
  )
}

export default Navbar