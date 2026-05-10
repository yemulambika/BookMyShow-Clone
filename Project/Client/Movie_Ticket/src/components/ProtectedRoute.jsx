import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { getCurrentUser } from '../calls/authCalls'
import { setUserData } from '../redux/userSlice'

function ProtectedRoute({children}) {
     const {userData} = useSelector(state =>state.user)
     const dispatch = useDispatch()
     
     useEffect(() => {
       // Ensure user data is consistent by fetching from server
       const fetchUserData = async () => {
         if (!userData) {
           try {
             const user = await getCurrentUser();
             if (user) {
               dispatch(setUserData(user));
             }
           } catch (error) {
             console.error("Error fetching user data:", error);
           }
         }
       };
       fetchUserData();
     }, [userData, dispatch]);
     
     if(!userData){
        return <Navigate to='/login'/>
     }
     return children
}

export default ProtectedRoute