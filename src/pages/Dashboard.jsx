import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useProducts } from '../context/ProductContext'
import { orderService } from '../services/orders'
import { motion } from 'framer-motion'
import { FaShoppingBag, FaCheck, FaClock, FaTimes, FaRocket } from 'react-icons/fa'
import ProductCard from '../components/products/ProductCard'
import ProductDetailsModal from '../components/products/ProductDetailsModal'
import CheckoutModal from '../components/products/CheckoutModal'
import { useNavigate } from 'react-router-dom'
import Loader from '../components/common/Loader'
import toast from 'react-hot-toast'

const Dashboard = () => {
    const { user } = useAuth()
    const { products, loading: productsLoading } = useProducts()
    const navigate = useNavigate()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0
    })
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

    useEffect(() => {
        fetchOrders()
    }, [user])

    const fetchOrders = async () => {
        if (!user) return

        try {
            setLoading(true)
            const { data, error } = await orderService.getUserOrders(user.id)

            if (!error && data) {
                setOrders(data)


                const stats = {
                    total: data.length,
                    pending: data.filter(o => o.status === 'pending').length,
                    approved: data.filter(o => o.status === 'approved').length,
                    rejected: data.filter(o => o.status === 'rejected').length
                }
                setStats(stats)
            }
        } catch (error) {
            console.error('Error fetching orders:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleBuyClick = (product) => {
        setSelectedProduct(product)
        setIsDetailsOpen(true)
    }

    const handleProceedToPayment = (product) => {
        setIsDetailsOpen(false)
        setIsCheckoutOpen(true)
    }

    const handleCheckoutSuccess = () => {
        setIsCheckoutOpen(false)
        fetchOrders()
    }

    if (loading || productsLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader size="large" />
            </div>
        )
    }

    return (
        <div className="space-y-8">

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden glass-card p-10 border-l-8 border-l-blue-600"
            >
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="bg-blue-600/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-blue-600/30">
                                Premium Account
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
                            Welcome back, <span className="gradient-text">{user?.user_metadata?.full_name?.split(' ')[0] || 'User'}</span>
                        </h1>
                        <p className="text-slate-400 text-lg font-medium max-w-xl">
                            Ready to level up your digital collection? Explore our newest premium assets below.
                        </p>
                    </div>
                </div>


                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 opacity-10 pointer-events-none">
                    <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="white" d="M44.7,-76.4C58.2,-69.2,70.1,-58.5,77.9,-45.4C85.7,-32.3,89.5,-16.2,88,0.9C86.5,17.9,79.7,35.8,69.5,49.2C59.2,62.6,45.4,71.5,30.5,77.3C15.5,83,0.5,85.6,-13.6,82.7C-27.7,79.8,-40.8,71.3,-52.8,61.9C-64.8,52.5,-75.7,42.2,-81.8,29.6C-87.9,17,-89.2,2.1,-86.2,-11.9C-83.2,-26,-75.9,-39.2,-65.3,-49.6C-54.7,-60,-40.8,-67.6,-27,-74.7C-13.2,-81.8,0.3,-88.4,14.6,-87.6C28.8,-86.8,31.2,-78.6,44.7,-76.4Z" transform="translate(100 100)" />
                    </svg>
                </div>
            </motion.div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Orders', val: stats.total, icon: FaShoppingBag, color: 'blue' },
                    { label: 'Pending Approval', val: stats.pending, icon: FaClock, color: 'yellow' },
                    { label: 'Successfully Approved', val: stats.approved, icon: FaCheck, color: 'green' },
                    { label: 'Rejected Orders', val: stats.rejected, icon: FaTimes, color: 'red' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * (i + 1) }}
                        className="glass-card p-6 overflow-hidden relative group"
                    >
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-2">{stat.label}</p>
                                <h3 className="text-4xl font-black text-white">{stat.val}</h3>
                            </div>
                            <div className={`p-4 bg-${stat.color}-500/10 rounded-2xl group-hover:scale-110 transition-transform`}>
                                <stat.icon className={`text-${stat.color}-500 text-2xl`} />
                            </div>
                        </div>
                        <div className={`absolute bottom-0 left-0 h-1 bg-${stat.color}-500/50 w-full opacity-0 group-hover:opacity-100 transition-opacity`} />
                    </motion.div>
                ))}
            </div>


            {orders.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card p-6"
                >
                    <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
                    <div className="space-y-4">
                        {orders.slice(0, 5).map((order) => (
                            <div
                                key={order.id}
                                className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <img
                                        src={order.products?.image_url || '/placeholder.png'}
                                        alt={order.products?.title}
                                        className="w-16 h-16 rounded-lg object-cover"
                                    />
                                    <div>
                                        <h4 className="font-semibold">{order.products?.title}</h4>
                                        <p className="text-sm text-gray-400">৳{order.amount?.toLocaleString('en-BD')}</p>
                                    </div>
                                </div>
                                <span
                                    className={`px-4 py-2 rounded-full text-sm font-semibold ${order.status === 'approved'
                                        ? 'bg-green-500/20 text-green-300'
                                        : order.status === 'pending'
                                            ? 'bg-yellow-500/20 text-yellow-300'
                                            : 'bg-red-500/20 text-red-300'
                                        }`}
                                >
                                    {order.status?.toUpperCase()}
                                </span>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => navigate('/dashboard/orders')}
                        className="btn-secondary w-full mt-4"
                    >
                        View All Orders
                    </button>
                </motion.div>
            )}


            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <h2 className="text-2xl font-bold mb-6">Available Products</h2>
                {products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.slice(0, 6).map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onBuyClick={handleBuyClick}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="glass-card p-12 text-center">
                        <FaRocket className="text-6xl text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">No products available yet</p>
                    </div>
                )}
            </motion.div>


            <ProductDetailsModal
                product={selectedProduct}
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                onProceed={handleProceedToPayment}
            />

            <CheckoutModal
                product={selectedProduct}
                user={user}
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                onSuccess={handleCheckoutSuccess}
            />
        </div>
    )
}

export default Dashboard
