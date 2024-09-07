import React, { useState } from 'react'
import axios from 'axios'
import styles from '../styles/initial.module.css'
import { CustomAlert } from  'alerts-react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

function Register({ setLogin }) {

    const [user,setUser] = useState({
        userEmail: '',
        userName: ''
    })
    
    const [loading,setLoading] = useState(false)

    const Register = async()=>{
        if(user.userEmail === '' || user.userName === '') return toast('Enter all fields')
        setLoading(true)
        await axios.post('/user/register',{
            name: user.userName,
            email: user.userEmail
        })
        .then(()=>{
            CustomAlert({
                title: 'You are Registered',
                description: 'Login with your credentials',
                type: 'success',
                showCancelButton: false,
                onConfirm: ()=> window.location.reload()
            })
            setLoading(false)
        })
    }


  return (
    <div className={styles.container}>
        <div className={styles.form}>
            <ToastContainer/>
            <h2 className={styles.title}>Sign Up</h2>
            <input 
                className={styles.input}
                type="email" 
                placeholder="Email" 
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
            {!loading?<button className={styles.loginButton} onClick={Register}>Register</button> : <CircularProgress/>}
            <p>already have an account? <span onClick={()=>setLogin(true)} style={{color: 'orchid', cursor: 'pointer'}}>Login</span></p>
        </div>
    </div>
  )
}

export default Register