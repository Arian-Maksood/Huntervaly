import { motion } from 'framer-motion'
import { FaTimes, FaDownload, FaShoppingCart } from 'react-icons/fa'

const ProductDetailsModal = ({ product, onClose, onBuyClick }) => {
  if (!product) return null

  // Icon based on category (user-facing)
  const getCategoryIcon = (category) => {
    const icons = {
      food: '🍔',
      grocery: '🛒',
      electronics: '💻',
      fashion: '👕',
      decoration: '🏠',
      apk: '📱',
      course: '🎓',
      file: '📄'
    }

    return icons[category] || '📦'
  }

  // Badge color based on system type
  const getBadgeStyle = (type) => {
    if (type === 'digital') {
      return 'bg-purple-500/20 text-purple-300 border-purple-500/50'
    }
    return 'bg-green-500/20 text-green-300 border-green-500/50'
  }

  const formatCategory = (category) => {
    if (!category) return ''
    return category.charAt(0).toUpperCase() + category.slice(1)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card w-full max-w-3xl max-h-[90vh] overflow-y-auto relative"
      >

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <FaTimes size={20} />
        </button>

        {/* Image Section */}
        <div className="relative h-72 w-full overflow-hidden rounded-t-xl">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl opacity-20">
              {getCategoryIcon(product.category)}
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-900 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">

          {/* Title & Category Badge */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-3xl font-bold">
              {product.title}
            </h2>

            <span
              className={`px-4 py-1 rounded-full text-sm font-semibold border ${getBadgeStyle(
                product.product_type
              )}`}
            >
              {formatCategory(product.category)}
            </span>
          </div>

          {/* Price */}
          <div className="text-2xl font-bold text-green-400">
            ৳{product.price?.toLocaleString('en-BD')}
          </div>

          {/* Description */}
          <p className="text-gray-300 leading-relaxed">
            {product.description}
          </p>

          {/* Optional: show product type subtly (not primary) */}
          <div className="text-xs text-gray-500 uppercase tracking-wide">
            {product.product_type}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={() => onBuyClick(product)}
              className="btn-primary flex items-center justify-center gap-2 flex-1"
            >
              <FaShoppingCart />
              Buy Now
            </button>

            {/* Download only for digital */}
            {product.product_type === 'digital' && product.download_link && (
              <a
                href={product.download_link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex items-center justify-center gap-2 flex-1"
              >
                <FaDownload />
                Download
              </a>
            )}
          </div>

        </div>
      </motion.div>
    </div>
  )
}

export default ProductDetailsModal