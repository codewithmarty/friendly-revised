import React from 'react';

import './UserLogOut.css'

const UserLogOut = ({ handleLogOut }) => {
    return (
        <div className='UserLogOut'>
            <button className="logout" onClick={handleLogOut}>Logout</button>
        </div>
    );
}

export default UserLogOut