import { supabase } from './supabase'

export const settingsService = {
    // Get all settings
    async getAllSettings() {
        try {
            const { data, error } = await supabase
                .from('settings')
                .select('*')

            if (error) throw error

            // Convert array to object
            const settings = {}
            data?.forEach(item => {
                settings[item.key] = item.value
            })

            return { data: settings, error: null }
        } catch (error) {
            return { data: null, error: error.message }
        }
    },

    // Get specific setting
    async getSetting(key) {
        try {
            const { data, error } = await supabase
                .from('settings')
                .select('value')
                .eq('key', key)
                .single()

            if (error) throw error
            return { data: data.value, error: null }
        } catch (error) {
            return { data: null, error: error.message }
        }
    },

    // Update setting
    async updateSetting(key, value) {
        try {
            const { data, error } = await supabase
                .from('settings')
                .upsert({
                    key,
                    value,
                    updated_at: new Date().toISOString()
                })
                .select()
                .single()

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            return { data: null, error: error.message }
        }
    }
}
