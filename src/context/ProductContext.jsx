import { createContext, useContext, useState, useEffect } from 'react'
import { productService } from '../services/products'
import toast from 'react-hot-toast'

const ProductContext = createContext({})

export const useProducts = () => {
    const context = useContext(ProductContext)
    if (!context) {
        throw new Error('useProducts must be used within ProductProvider')
    }
    return context
}

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const { data, error } = await productService.getAllProducts()

            if (error) {
                toast.error('Failed to load products')
                return
            }

            setProducts(data || [])
        } catch (error) {
            toast.error('Failed to load products')
        } finally {
            setLoading(false)
        }
    }

    const getProductById = async (id) => {
        try {
            const { data, error } = await productService.getProductById(id)

            if (error) {
                toast.error('Failed to load product')
                return null
            }

            return data
        } catch (error) {
            toast.error('Failed to load product')
            return null
        }
    }

    const createProduct = async (productData) => {
        try {
            const { data, error } = await productService.createProduct(productData)

            if (error) {
                toast.error('Failed to create product')
                return { success: false, error }
            }

            setProducts(prev => [data, ...prev])
            toast.success('Product created successfully')
            return { success: true, data }
        } catch (error) {
            toast.error('Failed to create product')
            return { success: false, error: error.message }
        }
    }

    const updateProduct = async (id, updates) => {
        try {
            const { data, error } = await productService.updateProduct(id, updates)

            if (error) {
                toast.error('Failed to update product')
                return { success: false, error }
            }

            setProducts(prev => prev.map(p => p.id === id ? data : p))
            toast.success('Product updated successfully')
            return { success: true, data }
        } catch (error) {
            toast.error('Failed to update product')
            return { success: false, error: error.message }
        }
    }

    const deleteProduct = async (id) => {
        try {
            const { error } = await productService.deleteProduct(id)

            if (error) {
                toast.error('Failed to delete product')
                return { success: false, error }
            }

            setProducts(prev => prev.filter(p => p.id !== id))
            toast.success('Product deleted successfully')
            return { success: true }
        } catch (error) {
            toast.error('Failed to delete product')
            return { success: false, error: error.message }
        }
    }

    const uploadProductImage = async (file) => {
        try {
            const { url, error } = await productService.uploadProductImage(file)

            if (error) {
                toast.error('Failed to upload image')
                return { success: false, error }
            }

            return { success: true, url }
        } catch (error) {
            toast.error('Failed to upload image')
            return { success: false, error: error.message }
        }
    }

    const getDownloadLink = async (productId) => {
        return await productService.getDownloadLink(productId)
    }

    const getProductWithLink = async (productId) => {
        return await productService.getProductWithLink(productId)
    }

    const value = {
        products,
        loading,
        fetchProducts,
        getProductById,
        createProduct,
        updateProduct,
        deleteProduct,
        uploadProductImage,
        getDownloadLink,
        getProductWithLink
    }

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    )
}
