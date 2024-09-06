import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'
import styles from '../styles/login.module.css'
function Login({ setLogin }) {
    const navigate = useNavigate()

    const [user, setUser] = useState({
        userEmail: '',
        userName: ''
    })

    const Login = async () => {
        if (user.userEmail === '' || user.userName === '') {
            return alert("Please enter all fields")
        }

        await axios.post('/user/login', {
            name: user.userName,
            email: user.userEmail
        })
        .then((res) => {
            if (res.data.status === 200) {
                window.localStorage.setItem('userEmail', user.userEmail)
                window.localStorage.setItem('userName', user.userName)
                window.localStorage.setItem('userRole', res.data.role)
                navigate('/dash', { replace: true })
            }
            if (res.data.status === 404) {
                alert("User does not exist")
                setUser({
                    userEmail: '',
                    userName: ''
                })
            }
        })
    }

    return (
        <div className={styles.container}>
            <div className={styles.form}>
                <h2 className={styles.title}>Welcome Back</h2>
                <input 
                    className={styles.input}
                    type="email" 
                    placeholder="Email Address" 
                    value={user.userEmail} 
                    onChange={(e) => setUser((prev) => ({ ...prev, userEmail: e.target.value }))} 
                />
                <input 
                    className={styles.input} 
                    type="text" 
                    placeholder="Username" 
                    value={user.userName} 
                    onChange={(e) => setUser((prev) => ({ ...prev, userName: e.target.value }))} 
                />
                <button className={styles.loginButton} onClick={Login}>Log In</button>
                <p>new user? <span onClick={()=>setLogin(false)}>Register</span></p>
            </div>
        </div>
    )
}

export default Login