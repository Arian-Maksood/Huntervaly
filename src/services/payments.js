import { supabase } from './supabase'

export const paymentService = {
    async submitManualPayment(orderData) {
        try {
            const { data, error } = await supabase
                .from('orders')
                .insert([{
                    ...orderData,
                    payment_method: 'manual',
                    status: 'pending'
                }])
                .select()
                .single()

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            return { data: null, error: error.message }
        }
    },

    async uploadPaymentScreenshot(file, orderId) {
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${orderId}-${Date.now()}.${fileExt}`
            const filePath = `payments/${fileName}`

            const { data, error } = await supabase.storage
                .from('payment-screenshots')
                .upload(filePath, file)

            if (error) throw error

            const { data: publicData } = supabase.storage
                .from('payment-screenshots')
                .getPublicUrl(filePath)

            return { url: publicData.publicUrl, error: null }
        } catch (error) {
            return { url: null, error: error.message }
        }
    },

    async approvePayment(orderId) {
        try {
            const { data, error } = await supabase
                .from('orders')
                .update({
                    status: 'approved',
                    updated_at: new Date().toISOString()
                })
                .eq('id', orderId)
                .select()
                .single()

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            return { data: null, error: error.message }
        }
    },

    async rejectPayment(orderId) {
        try {
            const { data, error } = await supabase
                .from('orders')
                .update({
                    status: 'rejected',
                    updated_at: new Date().toISOString()
                })
                .eq('id', orderId)
                .select()
                .single()

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            return { data: null, error: error.message }
        }
    },

    async processRazorpayPayment(orderData, paymentId) {
        try {
            const { data, error } = await supabase
                .from('orders')
                .insert([{
                    ...orderData,
                    payment_method: 'razorpay',
                    razorpay_payment_id: paymentId,
                    status: 'approved'
                }])
                .select()
                .single()

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            return { data: null, error: error.message }
        }
    },

    async getPaymentSettings() {
        try {
            const { data, error } = await supabase
                .from('settings')
                .select('*')
                .in('key', ['manual_payment_enabled', 'manual_payment_instructions', 'razorpay_enabled'])

            if (error) throw error

            const settings = {}
            data?.forEach(item => {
                settings[item.key] = item.value
            })

            return { data: settings, error: null }
        } catch (error) {
            return { data: null, error: error.message }
        }
    },

    async updatePaymentSettings(key, value) {
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
