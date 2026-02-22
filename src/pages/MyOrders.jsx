import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { orderService } from '../services/orders'
import { motion } from 'framer-motion'
import { FaDownload, FaFilter, FaSearch, FaReceipt } from 'react-icons/fa'
import { useProducts } from '../context/ProductContext'
import Loader from '../components/common/Loader'
import toast from 'react-hot-toast'

const MyOrders = () => {
    const { user } = useAuth()
    const { getDownloadLink } = useProducts()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')

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
            }
        } catch (error) {
            console.error('Error fetching orders:', error)
            toast.error('Failed to load orders')
        } finally {
            setLoading(false)
        }
    }

    const filteredOrders = orders.filter(order => {
        const matchesFilter = filter === 'all' || order.status === filter
        const matchesSearch = order.products?.title.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesFilter && matchesSearch
    })

    const handleDownload = async (order) => {
        if (order.status !== 'approved') {
            toast.error('This order is not approved yet')
            return
        }

        const downloadToast = toast.loading('Verifying access and generating secure link...')

        try {
            const { data: link, error } = await getDownloadLink(order.product_id)

            if (error || !link) {
                toast.error('Access verification failed or link not found', { id: downloadToast })
                return
            }

            window.open(link, '_blank')
            toast.success('Download started securely', { id: downloadToast })
        } catch (error) {
            toast.error('Failed to generate secure link', { id: downloadToast })
        }
    }

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
            approved: 'bg-green-500/20 text-green-300 border-green-500/50',
            rejected: 'bg-red-500/20 text-red-300 border-red-500/50'
        }
        return badges[status] || badges.pending
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader size="large" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
            >
                <h1 className="text-3xl font-bold gradient-text mb-2">My Orders</h1>
                <p className="text-gray-400">View and manage your purchase history</p>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6"
            >
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search orders..."
                            className="input-field pl-12 w-full"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex gap-2">
                        {['all', 'pending', 'approved', 'rejected'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === status
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Orders List */}
            {filteredOrders.length > 0 ? (
                <div className="space-y-4">
                    {filteredOrders.map((order, index) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card p-6 hover:scale-[1.02] transition-transform"
                        >
                            <div className="flex flex-col md:flex-row md:items-center gap-6">
                                {/* Product Image */}
                                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex-shrink-0">
                                    {order.products?.image_url ? (
                                        <img
                                            src={order.products.image_url}
                                            alt={order.products.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl">
                                            📦
                                        </div>
                                    )}
                                </div>

                                {/* Order Info */}
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-2">{order.products?.title}</h3>
                                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                                        <p>
                                            <span className="font-semibold">Amount:</span> ৳{order.amount?.toLocaleString('en-BD')}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Payment:</span> {order.payment_method?.toUpperCase()}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Date:</span>{' '}
                                            {new Date(order.created_at).toLocaleDateString('en-IN')}
                                        </p>
                                        {order.utr_number && (
                                            <p>
                                                <span className="font-semibold">UTR:</span> {order.utr_number}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Status & Actions */}
                                <div className="flex flex-col items-end gap-3">
                                    <span
                                        className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusBadge(order.status)}`}
                                    >
                                        {order.status?.toUpperCase()}
                                    </span>

                                    {order.status === 'approved' && (
                                        <button
                                            onClick={() => handleDownload(order)}
                                            className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
                                        >
                                            <FaDownload />
                                            Download
                                        </button>
                                    )}

                                    {order.status === 'rejected' && (
                                        <p className="text-red-400 text-sm">Payment rejected</p>
                                    )}

                                    {order.status === 'pending' && (
                                        <p className="text-yellow-400 text-sm">Awaiting approval</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-12 text-center"
                >
                    <FaReceipt className="text-6xl text-gray-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">No Orders Found</h3>
                    <p className="text-gray-400">
                        {filter !== 'all'
                            ? `You don't have any ${filter} orders`
                            : "You haven't made any purchases yet"}
                    </p>
                </motion.div>
            )}
        </div>
    )
}

export default MyOrders
