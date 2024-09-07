import React, { useState } from 'react'
import axios from 'axios'
import styles from '../styles/initial.module.css'
import { CustomAlert } from  'alerts-react'

function Register({ setLogin }) {

    const [user,setUser] = useState({
        userEmail: '',
        userName: ''
    })

    const Register = async()=>{
        console.log(user)
        if(user.userEmail === '' || user.userName === '') return alert("Enter all fields")
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
        })
    }


  return (
    <div className={styles.container}>
        <div className={styles.form}>
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
            <button className={styles.loginButton} onClick={Register}>Register</button>
            <p>already have an account? <span onClick={()=>setLogin(true)} style={{color: 'orchid', cursor: 'pointer'}}>Login</span></p>
        </div>
    </div>
  )
}

export default Register