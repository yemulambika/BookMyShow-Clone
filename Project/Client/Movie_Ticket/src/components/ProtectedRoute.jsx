import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { Spin } from 'antd'
import { getCurrentUser } from '../calls/authCalls'
import { setUserData } from '../redux/userSlice'

function ProtectedRoute({ children }) {
  const { userData } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  // Start in a loading state so a hard refresh doesn't redirect to /login
  // before we've had a chance to restore the session from the cookie.
  const [checking, setChecking] = useState(!userData)

  useEffect(() => {
    let active = true
    const fetchUserData = async () => {
      if (userData) {
        setChecking(false)
        return
      }
      try {
        const user = await getCurrentUser()
        if (active && user) {
          dispatch(setUserData(user))
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        if (active) setChecking(false)
      }
    }
    fetchUserData()
    return () => {
      active = false
    }
  }, [userData, dispatch])

  if (checking) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Spin size="large" />
      </div>
    )
  }

  if (!userData) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
