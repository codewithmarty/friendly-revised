import React, { useState } from 'react'

import LoginForm from '../../components/LoginForm/LoginForm';
import SignUpForm from '../../components/SignUpForm/SignUpForm';

import './AuthPage.css'

const AuthPage = ({ setUserInState }) => {

    const [showLogin, setShowLogin] = useState(true)

    return (
        <main className="AuthPage">
        <div>
            <h3 className="member-button" onClick={() => setShowLogin(!showLogin)}>
                {showLogin ? 'Not a member yet? Sign Up!' : 'Already a member? Log in!'}
            </h3>
        </div>
        {showLogin ? 
            <LoginForm setUserInState={setUserInState}/> : 
            <SignUpForm setUserInState={setUserInState} />}
        </main>
    );

}

export default AuthPage