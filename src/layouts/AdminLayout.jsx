import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { FaHome, FaBox, FaShoppingBag, FaCog, FaBars, FaTimes, FaSignOutAlt, FaArrowLeft } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { useSettings } from '../context/SettingsContext'

const AdminLayout = () => {
    const { user, signOut } = useAuth()
    const { settings } = useSettings()
    const navigate = useNavigate()
    const location = useLocation()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

    const menuItems = [
        { path: '/admin', icon: <FaHome />, label: 'Overview' },
        { path: '/admin/products', icon: <FaBox />, label: 'Products' },
        { path: '/admin/orders', icon: <FaShoppingBag />, label: 'Orders' },
        { path: '/admin/settings', icon: <FaCog />, label: 'Settings' },
    ]

    return (
        <div className="min-h-screen relative selection:bg-red-500/30">
            {/* Background Decoration */}
            <div className="mesh-bg opacity-40 grayscale-[0.5]" />
            <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-600/5 blur-[120px] rounded-full -z-10" />

            {/* Mobile Menu Button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 glass-card p-4 rounded-xl shadow-lg border-white/20 active:scale-95 transition-transform"
            >
                {sidebarOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>

            {/* Sidebar */}
            <AnimatePresence>
                {(sidebarOpen || window.innerWidth >= 1024) && (
                    <motion.aside
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        transition={{ duration: 0.3 }}
                        className="fixed left-0 top-0 h-full w-64 glass-card border-r border-white/10 z-40 lg:translate-x-0 custom-scrollbar overflow-y-auto"
                    >
                        <div className="p-6 border-b border-white/10">
                            <h2 className="text-2xl font-bold gradient-text">Admin Panel</h2>
                            <p className="text-sm text-gray-400 mt-1">{settings.site_name}</p>
                        </div>

                        {/* Admin Info */}
                        <div className="p-6 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-orange-600 flex items-center justify-center text-xl font-bold">
                                    A
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="font-semibold text-white">Administrator</p>
                                    <p className="text-sm text-gray-400 truncate">
                                        {user?.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <nav className="p-4 space-y-2">
                            {menuItems.map((item) => {
                                const isActive = location.pathname === item.path
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 group ${isActive
                                            ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.2)]'
                                            : 'text-slate-500 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        <span className={`text-xl transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-500'}`}>{item.icon}</span>
                                        <span className="font-bold tracking-tight">{item.label}</span>
                                    </Link>
                                )
                            })}
                        </nav>

                        {/* Back to Dashboard */}
                        <div className="absolute bottom-16 left-0 right-0 px-4">
                            <Link
                                to="/dashboard"
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all"
                            >
                                <FaArrowLeft />
                                <span className="font-medium">Back to Dashboard</span>
                            </Link>
                        </div>

                        {/* Sign Out */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
                            >
                                <FaSignOutAlt />
                                <span className="font-medium">Sign Out</span>
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="lg:ml-64 min-h-screen">
                {/* Top Navbar */}
                <header className="glass-card border-b border-white/10 sticky top-0 z-30">
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="lg:hidden w-12"></div>
                            <h2 className="text-xl font-semibold text-white">
                                {menuItems.find(item => item.path === location.pathname)?.label || 'Admin'}
                            </h2>
                            <div className="text-sm text-gray-400">
                                Admin Dashboard
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6 custom-scrollbar overflow-y-auto">
                    <Outlet />
                </main>
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                />
            )}
        </div>
    )
}

export default AdminLayout
