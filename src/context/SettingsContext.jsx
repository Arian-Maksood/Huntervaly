import { createContext, useContext, useState, useEffect } from 'react'
import { settingsService } from '../services/settings'
import { supabase } from '../services/supabase'

const SettingsContext = createContext()

export const useSettings = () => {
    const context = useContext(SettingsContext)
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider')
    }
    return context
}

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        site_name: 'Huntervaly',
        manual_payment_enabled: true,
        manual_payment_instructions: '',
        razorpay_enabled: false
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        if (!supabase) {
            setLoading(false)
            return
        }
        try {
            setLoading(true)
            const { data, error } = await settingsService.getAllSettings()
            if (!error && data) {
                setSettings(prev => ({
                    ...prev,
                    ...data
                }))
            }
        } catch (error) {
            console.error('Error fetching settings:', error)
        } finally {
            setLoading(false)
        }
    }

    const updateSiteName = async (newName) => {
        const { error } = await settingsService.updateSetting('site_name', newName)
        if (!error) {
            setSettings(prev => ({ ...prev, site_name: newName }))
            return { success: true }
        }
        return { success: false, error }
    }

    const value = {
        settings,
        loading,
        fetchSettings,
        updateSiteName
    }

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    )
}
