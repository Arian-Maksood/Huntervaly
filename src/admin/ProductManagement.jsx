import { useState } from 'react'
import { useProducts } from '../context/ProductContext'
import { motion } from 'framer-motion'
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaTimes,
  FaImage,
  FaUpload
} from 'react-icons/fa'

const ProductManagement = () => {
  const {
    products,
    loading,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImage,
    getProductWithLink
  } = useProducts()

  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [uploading, setUploading] = useState(false)

  const defaultForm = {
    title: '',
    description: '',
    price: '',
    product_type: 'physical',
    category: '',
    download_link: '',
    image_url: ''
  }

  const [formData, setFormData] = useState(defaultForm)

  const filteredProducts = products.filter(p =>
    p.title?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleOpenModal = async (product = null) => {
    if (product) {
      setEditingProduct(product)
      const { data } = await getProductWithLink(product.id)

      setFormData({
        title: data?.title || '',
        description: data?.description || '',
        price: data?.price || '',
        product_type: data?.product_type || 'physical',
        category: data?.category || '',
        download_link: data?.download_link || '',
        image_url: data?.image_url || ''
      })
    } else {
      setEditingProduct(null)
      setFormData(defaultForm)
    }

    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingProduct(null)
    setFormData(defaultForm)
  }

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const { url } = await uploadProductImage(file)

    if (url) {
      setFormData(prev => ({ ...prev, image_url: url }))
    }

    setUploading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      ...formData,
      price: parseFloat(formData.price)
    }

    let result
    if (editingProduct) {
      result = await updateProduct(editingProduct.id, payload)
    } else {
      result = await createProduct(payload)
    }

    if (!result?.error) handleCloseModal()
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      await deleteProduct(id)
    }
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="glass-card p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold gradient-text">
          Product Management
        </h1>

        <button
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2"
        >
          <FaPlus /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="glass-card p-6 relative">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="input-field pl-12 w-full"
        />
      </div>

      {/* Table */}
      <div className="glass-card p-6">
        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3">Product</th>
                <th className="text-left py-3">Type</th>
                <th className="text-left py-3">Category</th>
                <th className="text-left py-3">Price</th>
                <th className="text-right py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id} className="border-b border-white/5">
                  <td>{product.title}</td>
                  <td>{product.product_type}</td>
                  <td>{product.category}</td>
                  <td>৳{product.price}</td>
                  <td className="text-right space-x-2">
                    <button
                      onClick={() => handleOpenModal(product)}
                      className="text-blue-400"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-400"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="glass-card p-8 w-full max-w-2xl"
          >
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <button onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Image Upload */}
              <div className="flex flex-col items-center gap-4">
                <label className="text-sm text-gray-400">Product Image</label>

                <div className="w-40 h-40 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center overflow-hidden shadow-lg">
                  {formData.image_url ? (
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaImage className="text-4xl text-white/70" />
                  )}
                </div>

                <label className="btn-secondary cursor-pointer flex items-center gap-2">
                  <FaUpload />
                  {uploading ? 'Uploading...' : 'Upload Image'}
                  <input
                    type="file"
                    onChange={handleImageChange}
                    hidden
                  />
                </label>
              </div>

              <input
                type="text"
                placeholder="Product Title"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="input-field w-full"
              />

              <textarea
                placeholder="Product Description"
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="input-field w-full"
              />

              <div className="grid grid-cols-2 gap-4">
                <select
                  value={formData.product_type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      product_type: e.target.value,
                      category: '',
                      download_link: ''
                    })
                  }
                  className="input-field w-full"
                >
                  <option value="physical">Physical</option>
                  <option value="digital">Digital</option>
                </select>

                <input
                  type="number"
                  placeholder="Price"
                  required
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="input-field w-full"
                />
              </div>

              {/* Category + Download Logic */}
              {formData.product_type === 'physical' && (
                <select
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="input-field w-full"
                >
                  <option value="">Select Category</option>
                  <option value="food">Food</option>
                  <option value="grocery">Grocery</option>
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion</option>
                  <option value="decoration">Decoration</option>
                </select>
              )}

              {formData.product_type === 'digital' && (
                <>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="input-field w-full"
                  >
                    <option value="">Select Digital Type</option>
                    <option value="apk">APK</option>
                    <option value="course">Course</option>
                    <option value="file">Digital File</option>
                  </select>

                  <input
                    type="url"
                    placeholder="Download Link"
                    required
                    value={formData.download_link}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        download_link: e.target.value
                      })
                    }
                    className="input-field w-full"
                  />
                </>
              )}

              <div className="flex gap-4 pt-2">
                <button type="submit" className="btn-primary flex-1">
                  {editingProduct ? 'Update' : 'Create'}
                </button>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default ProductManagement