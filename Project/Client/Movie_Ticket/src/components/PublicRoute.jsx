import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

function PublicRoute({children}) {
     const {userData} = useSelector(state =>state.user)
     
     if(userData){
        // Redirect based on role
        if(userData.role === 'admin') {
          return <Navigate to='/admin'/>
        } else if(userData.role === 'partner') {
          return <Navigate to='/partner'/>
        } else {
          return <Navigate to='/home'/>
        }
     }
     return children
}

export default PublicRoute