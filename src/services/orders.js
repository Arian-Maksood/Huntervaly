import { supabase } from './supabase'

export const orderService = {
    async getUserOrders(userId) {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`
          *,
          products (
            id,
            title,
            image_url,
            product_type
          )
        `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false })

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            return { data: null, error: error.message }
        }
    },

    async getAllOrders() {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`
          *,
          products (
            id,
            title,
            image_url,
            product_type
          ),
          users (
            id,
            email,
            full_name
          )
        `)
                .order('created_at', { ascending: false })

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            return { data: null, error: error.message }
        }
    },

    async createOrder(orderData) {
        try {
            const { data, error } = await supabase
                .from('orders')
                .insert([orderData])
                .select()
                .single()

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            return { data: null, error: error.message }
        }
    },

    async updateOrderStatus(orderId, status) {
        try {
            const { data, error } = await supabase
                .from('orders')
                .update({
                    status,
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

    async getOrderById(orderId) {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`
          *,
          products (
            id,
            title
          )
        `)
                .eq('id', orderId)
                .single()

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            return { data: null, error: error.message }
        }
    }
}
