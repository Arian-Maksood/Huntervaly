import { useState, useEffect } from 'react'
import { orderService } from '../services/orders'
import { paymentService } from '../services/payments'
import { motion } from 'framer-motion'
import { FaCheck, FaTimes, FaEye, FaSearch, FaFilter } from 'react-icons/fa'
import toast from 'react-hot-toast'
import Loader from '../components/common/Loader'

const OrderManagement = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            setLoading(true)
            const { data, error } = await orderService.getAllOrders()

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

    const handleApprove = async (orderId) => {
        if (window.confirm('Are you sure you want to approve this order?')) {
            const { error } = await paymentService.approvePayment(orderId)
            if (!error) {
                fetchOrders()
            }
        }
    }

    const handleReject = async (orderId) => {
        if (window.confirm('Are you sure you want to reject this order?')) {
            const { error } = await paymentService.rejectPayment(orderId)
            if (!error) {
                fetchOrders()
            }
        }
    }

    const handleViewDetails = (order) => {
        setSelectedOrder(order)
        setShowModal(true)
    }

    const filteredOrders = orders.filter(order => {
        const matchesFilter = filter === 'all' || order.status === filter
        const matchesSearch =
            order.products?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.users?.email.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesFilter && matchesSearch
    })

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

            <div className="glass-card p-6">
                <h1 className="text-3xl font-bold gradient-text mb-2">Order Management</h1>
                <p className="text-gray-400">Review and manage customer orders</p>
            </div>


            <div className="glass-card p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by product or user email..."
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
                                    ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>


            <div className="glass-card p-6">
                {filteredOrders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-4 px-4 text-gray-400 font-semibold">Product</th>
                                    <th className="text-left py-4 px-4 text-gray-400 font-semibold">Customer</th>
                                    <th className="text-left py-4 px-4 text-gray-400 font-semibold">Amount</th>
                                    <th className="text-left py-4 px-4 text-gray-400 font-semibold">Status</th>
                                    <th className="text-right py-4 px-4 text-gray-400 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order) => (
                                    <motion.tr
                                        key={order.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                    >
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={order.products?.image_url || '/placeholder.png'}
                                                    alt={order.products?.title}
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                                <div>
                                                    <h4 className="font-semibold text-white">{order.products?.title}</h4>
                                                    <p className="text-sm text-gray-400">{order.payment_method?.toUpperCase()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div>
                                                <p className="font-semibold text-white">{order.users?.full_name || 'N/A'}</p>
                                                <p className="text-sm text-gray-400">{order.users?.email}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="font-semibold text-white">৳{order.amount?.toLocaleString('en-BD')}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(order.status)}`}
                                            >
                                                {order.status?.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleViewDetails(order)}
                                                    className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                                                    title="View Details"
                                                >
                                                    <FaEye />
                                                </button>
                                                {order.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(order.id)}
                                                            className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                                                            title="Approve"
                                                        >
                                                            <FaCheck />
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(order.id)}
                                                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                                                            title="Reject"
                                                        >
                                                            <FaTimes />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-gray-400 py-12">No orders found</p>
                )}
            </div>


            {showModal && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">Order Details</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="space-y-6">

                            <div>
                                <h3 className="text-lg font-semibold mb-3">Product Information</h3>
                                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                                    <img
                                        src={selectedOrder.products?.image_url || '/placeholder.png'}
                                        alt={selectedOrder.products?.title}
                                        className="w-20 h-20 rounded-lg object-cover"
                                    />
                                    <div>
                                        <h4 className="font-semibold text-lg">{selectedOrder.products?.title}</h4>
                                        <p className="text-gray-400">{selectedOrder.products?.product_type?.toUpperCase()}</p>
                                    </div>
                                </div>
                            </div>


                            <div>
                                <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                                <div className="p-4 bg-white/5 rounded-lg space-y-2">
                                    <p><span className="text-gray-400">Name:</span> {selectedOrder.users?.full_name || 'N/A'}</p>
                                    <p><span className="text-gray-400">Email:</span> {selectedOrder.users?.email}</p>
                                </div>
                            </div>


                            <div>
                                <h3 className="text-lg font-semibold mb-3">Payment Information</h3>
                                <div className="p-4 bg-white/5 rounded-lg space-y-2">
                                    <p><span className="text-gray-400">Amount:</span> ৳{selectedOrder.amount?.toLocaleString('en-BD')}</p>
                                    <p><span className="text-gray-400">Method:</span> {selectedOrder.payment_method?.toUpperCase()}</p>
                                    <p><span className="text-gray-400">Status:</span>
                                        <span
                                            className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(selectedOrder.status)}`}
                                        >
                                            {selectedOrder.status?.toUpperCase()}
                                        </span>
                                    </p>
                                    {selectedOrder.utr_number && (
                                        <p><span className="text-gray-400">UTR Number:</span> {selectedOrder.utr_number}</p>
                                    )}
                                    {selectedOrder.razorpay_payment_id && (
                                        <p><span className="text-gray-400">Razorpay ID:</span> {selectedOrder.razorpay_payment_id}</p>
                                    )}
                                    <p><span className="text-gray-400">Date:</span> {new Date(selectedOrder.created_at).toLocaleString('en-IN')}</p>
                                </div>
                            </div>


                            {selectedOrder.screenshot_url && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Payment Screenshot</h3>
                                    <a
                                        href={selectedOrder.screenshot_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10 group"
                                    >
                                        <div className="relative aspect-auto max-h-[500px] overflow-hidden rounded-lg">
                                            <img
                                                src={selectedOrder.screenshot_url}
                                                alt="Payment Screenshot"
                                                className="w-full object-contain"
                                                onLoad={(e) => console.log('Screenshot loaded:', e.target.src)}
                                                onError={(e) => {
                                                    console.error('Screenshot failed to load:', e.target.src);
                                                    e.target.src = 'https://placehold.co/600x400/1e293b/white?text=Screenshot+Not+Accessible';
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <span className="text-white font-medium px-4 py-2 bg-blue-600 rounded-lg">View Full Image</span>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            )}


                            {selectedOrder.status === 'pending' && (
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => {
                                            handleApprove(selectedOrder.id)
                                            setShowModal(false)
                                        }}
                                        className="btn-primary flex-1 flex items-center justify-center gap-2"
                                    >
                                        <FaCheck />
                                        Approve Order
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleReject(selectedOrder.id)
                                            setShowModal(false)
                                        }}
                                        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 flex-1 flex items-center justify-center gap-2"
                                    >
                                        <FaTimes />
                                        Reject Order
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}

export default OrderManagement
