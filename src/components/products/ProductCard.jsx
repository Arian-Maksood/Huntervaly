import { motion } from 'framer-motion'
import { FaTag, FaShoppingCart } from 'react-icons/fa'

const ProductCard = ({ product, onBuyClick }) => {

    // Category icon system (based on category, not type)
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

    // Badge styling based on product_type (system logic)
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
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-6 h-full flex flex-col group cursor-pointer"
        >
            {/* Product Image */}
            <div className="relative mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-500/10 aspect-video">

                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                        {getCategoryIcon(product.category)}
                    </div>
                )}

                {/* Category Badge (Customer-facing) */}
                <div className="absolute top-3 right-3">
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getBadgeStyle(product.product_type)}`}
                    >
                        {formatCategory(product.category)}
                    </span>
                </div>
            </div>

            {/* Product Info */}
            <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                    {product.title}
                </h3>

                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {product.description}
                </p>
            </div>

            {/* Price and Action */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                    <FaTag className="text-green-400" />
                    <span className="text-2xl font-bold text-white">
                        ৳{product.price?.toLocaleString('en-BD')}
                    </span>
                </div>

                <button
                    onClick={() => onBuyClick(product)}
                    className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
                >
                    <FaShoppingCart />
                    Buy Now
                </button>
            </div>
        </motion.div>
    )
}

export default ProductCard