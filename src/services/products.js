import { supabase } from './supabase'

export const productService = {

  async getAllProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  async getProductById(id) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  async createProduct(productData) {
    try {
      const { download_link, product_type, category, ...rest } = productData

      // Insert main product
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert([{
          ...rest,
          product_type,
          category
        }])
        .select()
        .single()

      if (productError) throw productError

      // Save download link only for digital
      if (product_type === 'digital' && download_link) {
        const { error: assetError } = await supabase
          .from('product_assets')
          .insert([{ product_id: product.id, download_link }])

        if (assetError) throw assetError
      }

      return { data: product, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  async updateProduct(id, updates) {
    try {
      const { download_link, product_type, category, ...rest } = updates

      const { data: product, error: productError } = await supabase
        .from('products')
        .update({
          ...rest,
          product_type,
          category
        })
        .eq('id', id)
        .select()
        .single()

      if (productError) throw productError

      // Update digital download link
      if (product_type === 'digital' && download_link) {
        const { error: assetError } = await supabase
          .from('product_assets')
          .upsert({
            product_id: id,
            download_link
          })

        if (assetError) throw assetError
      }

      return { data: product, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  async deleteProduct(id) {
    try {
      // Delete asset first (if exists)
      await supabase
        .from('product_assets')
        .delete()
        .eq('product_id', id)

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  },

  async getProductWithLink(id) {
    try {
      const [productRes, assetRes] = await Promise.all([
        supabase.from('products').select('*').eq('id', id).single(),
        supabase.from('product_assets').select('download_link').eq('product_id', id).single()
      ])

      if (productRes.error) throw productRes.error

      return {
        data: {
          ...productRes.data,
          download_link: assetRes.data?.download_link || ''
        },
        error: null
      }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  async uploadProductImage(file) {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `products/${fileName}`

      const { error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file)

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      return { url: publicUrl, error: null }
    } catch (error) {
      return { url: null, error: error.message }
    }
  }

}