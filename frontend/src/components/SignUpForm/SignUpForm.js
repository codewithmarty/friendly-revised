import React, { useState } from 'react'

import './SignUpForm.css'

const SignUpForm = ({ setUserInState }) => {

    const [state, setState] = useState({
        name: '',
        email: '',
        password: '.',
        confirm: '',
        error: ''
    })


    const [disable, setDisable] = useState(false)

    const handleChange = (evt) => {
        setState({...state,
            [evt.target.name]: evt.target.value,
            error: ''
        })
    }

    const handleSubmit = async (evt) => {
        evt.preventDefault()
        setDisable(state.password !== state.confirm)
        try {
            const fetchResponse = await fetch('/api/users/signup', {
              method: 'POST',
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: state.name, email: state.email, password: state.password })
            })
      
            if (!fetchResponse.ok) throw new Error('Fetch failed - Bad request')
      
            let token = await fetchResponse.json() 
            localStorage.setItem('token', token)
      
            const userDoc = JSON.parse(atob(token.split('.')[1])).user
            setUserInState(userDoc)
      
          } catch (err) {
            setState({ ...state, error: 'Sign Up Failed - Try Again' });
        }
    }
    
    return (
        <div>
            <div className="form-container">
                <form className="signup-form" autoComplete="off" onSubmit={handleSubmit}>
                    <input type="text" name="name" placeholder="Name" onChange={handleChange} required /><br/>
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required /><br/>
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} required /><br/>
                    <input type="password" name="confirm" placeholder="Confirm" onChange={handleChange} required /><br/>
                    <button className="sign-up" type="submit" disabled={disable}>SIGN UP</button>
                </form>
            </div>
            <p className="error-message">&nbsp;{state.error}</p>
        </div>
    )
}

export default SignUpForm