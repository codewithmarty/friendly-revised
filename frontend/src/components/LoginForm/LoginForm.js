import React, { useState } from 'react'

import './LoginForm.css'

const LoginForm = ({ setUserInState }) => {

    const [state, setState] = useState({
        email: '',
        password: '',
        error: ''
    })

    const handleChange = (evt) => {
        setState({...state,
            [evt.target.name]: evt.target.value,
            error: ''
        })
    }

    const handleSubmit = async (evt) => {
        evt.preventDefault()
        try {
            const fetchResponse = await fetch('/api/users/login', {
              method: 'POST',
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: state.email, password: state.password, })
            })
      
            if (!fetchResponse.ok) throw new Error('Fetch failed - Bad request')
      
            let token = await fetchResponse.json() 
            localStorage.setItem('token', token)
      
            const userDoc = JSON.parse(atob(token.split('.')[1])).user
            setUserInState(userDoc)
      
          } catch (err) {
          setState({ ...state, error: 'Login Failed - Try Again' });
        }
    }

    return (
        <div>
            <div className="form-container" onSubmit={handleSubmit}>
            <form className='loginForm' autoComplete="off" >
                <input className="user-box" type="text" placeholder="Email" name="email" onChange={handleChange} required /><br/>
                <input className="user-box" type="password" placeholder="Password" name="password" onChange={handleChange} required /><br/>
                <button className="log-in" type="submit">LOG IN</button><br/>
            </form>
            </div>
            <p className="error-message">&nbsp;{state.error}</p>
        </div>
    )
}

export default LoginForm