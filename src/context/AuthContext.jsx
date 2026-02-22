import { createContext, useContext, useState, useEffect } from 'react'
import { supabase, authService } from '../services/supabase'
import toast from 'react-hot-toast'

const AuthContext = createContext({})

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {

        if (!supabase) {
            setLoading(false)
            return
        }
        checkUser()


        if (!supabase) return;
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                setUser(session.user)
                checkAdminStatus(session.user.id)
            } else {
                setUser(null)
                setIsAdmin(false)
            }
            setLoading(false)
        })

        return () => {
            subscription?.unsubscribe()
        }
    }, [])

    const checkUser = async () => {
        try {
            const { session } = await authService.getSession()
            if (session?.user) {
                setUser(session.user)
                await checkAdminStatus(session.user.id)
            }
        } catch (error) {
            console.error('Error checking user:', error)
        } finally {
            setLoading(false)
        }
    }

    const checkAdminStatus = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('role')
                .eq('id', userId)
                .single()

            if (!error && data?.role === 'admin') {
                setIsAdmin(true)
            } else {
                setIsAdmin(false)
            }
        } catch (error) {
            console.error('Error checking admin status:', error)
            setIsAdmin(false)
        }
    }

    const signUp = async (email, password, fullName) => {
        try {
            const { data, error } = await authService.signUp(email, password, fullName)

            if (error) {
                toast.error(error)
                return { success: false, error }
            }


            if (data?.user) {
                await supabase.from('users').insert([{
                    id: data.user.id,
                    email: data.user.email,
                    full_name: fullName,
                    role: 'user'
                }])
            }

            toast.success('Account created successfully! Please check your email to verify.')
            return { success: true, data }
        } catch (error) {
            toast.error('Failed to create account')
            return { success: false, error: error.message }
        }
    }

    const signIn = async (email, password) => {
        try {
            const { data, error } = await authService.signIn(email, password)

            if (error) {
                toast.error(error)
                return { success: false, error }
            }

            toast.success('Welcome back!')
            return { success: true, data }
        } catch (error) {
            toast.error('Failed to sign in')
            return { success: false, error: error.message }
        }
    }

    const signOut = async () => {
        try {
            const { error } = await authService.signOut()

            if (error) {
                toast.error(error)
                return { success: false, error }
            }

            setUser(null)
            setIsAdmin(false)
            toast.success('Signed out successfully')
            return { success: true }
        } catch (error) {
            toast.error('Failed to sign out')
            return { success: false, error: error.message }
        }
    }

    const updateProfile = async (updates) => {
        try {
            const { data, error } = await authService.updateProfile(updates)

            if (error) {
                toast.error(error)
                return { success: false, error }
            }


            if (user) {
                await supabase
                    .from('users')
                    .update(updates)
                    .eq('id', user.id)
            }

            toast.success('Profile updated successfully')
            return { success: true, data }
        } catch (error) {
            toast.error('Failed to update profile')
            return { success: false, error: error.message }
        }
    }

    const value = {
        user,
        loading,
        isAdmin,
        signUp,
        signIn,
        signOut,
        updateProfile,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
