import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'
import styles from '../styles/initial.module.css'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function Login({ setLogin }) {
    const navigate = useNavigate()
    const [loading,setLoading] = useState(false)

    const [user, setUser] = useState({
        userEmail: '',
        userName: ''
    })

    const Login = async () => {
        if (user.userEmail === '' || user.userName === '') {
            return toast('Enter all fields')
        }
        setLoading(true)
        await axios.post('/user/login', {
            name: user.userName,
            email: user.userEmail
        })
        .then((res) => {
            setLoading(false)
            if (res.data.status === 200) {
                window.localStorage.setItem('userEmail', user.userEmail)
                window.localStorage.setItem('userName', user.userName)
                window.localStorage.setItem('userRole', res.data.role)
                navigate('/dash', { replace: true })
            }
            if (res.data.status === 404) {
                toast('Wrong Credentials')
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
                <ToastContainer/>
                {!loading?<button className={styles.loginButton} onClick={Login}>Log In</button> : <CircularProgress/>}
                <p>new user? <span onClick={()=>setLogin(false)} style={{color: 'orchid', cursor: 'pointer'}}>Register</span></p>
            </div>
        </div>
    )
}

export default Login