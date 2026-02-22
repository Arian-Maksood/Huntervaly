import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaUsers, FaShoppingBag, FaRupeeSign, FaClock, FaArrowUp, FaArrowDown } from 'react-icons/fa'
import { supabase } from '../services/supabase'
import Loader from '../components/common/Loader'
import { useSettings } from '../context/SettingsContext'

const AdminDashboard = () => {
    const { settings } = useSettings()
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0
    })
    const [recentOrders, setRecentOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            setLoading(true)


            const { count: usersCount } = await supabase
                .from('users')
                .select('*', { count: 'exact', head: true })


            const { data: orders } = await supabase
                .from('orders')
                .select(`
          *,
          products (title, image_url),
          users (email, full_name)
        `)
                .order('created_at', { ascending: false })
                .limit(5)


            const { data: allOrders } = await supabase
                .from('orders')
                .select('amount, status')

            const totalRevenue = allOrders?.reduce((sum, order) => {
                return order.status === 'approved' ? sum + (order.amount || 0) : sum
            }, 0) || 0

            const pendingCount = allOrders?.filter(o => o.status === 'pending').length || 0

            setStats({
                totalUsers: usersCount || 0,
                totalOrders: allOrders?.length || 0,
                totalRevenue,
                pendingOrders: pendingCount
            })

            setRecentOrders(orders || [])
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    const statCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: <FaUsers />,
            gradient: 'from-blue-500 to-cyan-500',
            bgGradient: 'from-blue-500/20 to-cyan-500/20',
            change: '+12%',
            positive: true
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders,
            icon: <FaShoppingBag />,
            gradient: 'from-purple-500 to-pink-500',
            bgGradient: 'from-purple-500/20 to-pink-500/20',
            change: '+8%',
            positive: true
        },
        {
            title: 'Total Revenue',
            value: `৳${stats.totalRevenue.toLocaleString('en-BD')}`,
            icon: <FaRupeeSign />,
            gradient: 'from-green-500 to-emerald-500',
            bgGradient: 'from-green-500/20 to-emerald-500/20',
            change: '+15%',
            positive: true
        },
        {
            title: 'Pending Orders',
            value: stats.pendingOrders,
            icon: <FaClock />,
            gradient: 'from-yellow-500 to-orange-500',
            bgGradient: 'from-yellow-500/20 to-orange-500/20',
            change: '-3%',
            positive: false
        }
    ]

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader size="large" />
            </div>
        )
    }

    return (
        <div className="space-y-8">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8"
            >
                <h1 className="text-3xl font-bold gradient-text mb-2">Admin Dashboard</h1>
                <p className="text-gray-400">Welcome to {settings.site_name} admin panel</p>
            </motion.div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`glass-card p-6 hover:scale-105 transition-transform cursor-pointer bg-gradient-to-br ${stat.bgGradient}`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.gradient}`}>
                                <div className="text-2xl text-white">{stat.icon}</div>
                            </div>
                            <div className={`flex items-center gap-1 text-sm ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                                {stat.positive ? <FaArrowUp /> : <FaArrowDown />}
                                {stat.change}
                            </div>
                        </div>
                        <h3 className="text-gray-400 text-sm mb-1">{stat.title}</h3>
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                    </motion.div>
                ))}
            </div>


            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-6"
            >
                <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>

                {recentOrders.length > 0 ? (
                    <div className="space-y-4">
                        {recentOrders.map((order) => (
                            <div
                                key={order.id}
                                className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <img
                                        src={order.products?.image_url || '/placeholder.png'}
                                        alt={order.products?.title}
                                        className="w-12 h-12 rounded-lg object-cover"
                                    />
                                    <div>
                                        <h4 className="font-semibold text-white">{order.products?.title}</h4>
                                        <p className="text-sm text-gray-400">
                                            {order.users?.full_name || order.users?.email}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="text-white font-semibold">৳{order.amount?.toLocaleString('en-BD')}</p>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'approved'
                                            ? 'bg-green-500/20 text-green-300'
                                            : order.status === 'pending'
                                                ? 'bg-yellow-500/20 text-yellow-300'
                                                : 'bg-red-500/20 text-red-300'
                                            }`}
                                    >
                                        {order.status?.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 text-center py-8">No orders yet</p>
                )}
            </motion.div>
        </div>
    )
}

export default AdminDashboard
