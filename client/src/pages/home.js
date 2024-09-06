import React, { useState } from 'react'
import Login from '../components/login'
import Register from '../components/register'

function Home() {

    const [login,setLogin] = useState(true)

  return (
    <div>
        <div>
            {
                login? <Login setLogin={setLogin}/> : <Register setLogin={setLogin}/>
            }
        </div>
    </div>
  )
}

export default Home