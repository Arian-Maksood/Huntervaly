import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { FaUser, FaEnvelope, FaSave, FaCamera } from 'react-icons/fa'
import toast from 'react-hot-toast'

const Profile = () => {
    const { user, updateProfile } = useAuth()
    const [formData, setFormData] = useState({
        full_name: user?.user_metadata?.full_name || '',
        email: user?.email || ''
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const { success } = await updateProfile({
            full_name: formData.full_name
        })

        setLoading(false)
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Profile Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8"
            >
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold">
                            {user?.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <button className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors">
                            <FaCamera className="text-white" />
                        </button>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold gradient-text mb-2">
                            {user?.user_metadata?.full_name || 'User'}
                        </h1>
                        <p className="text-gray-400">{user?.email}</p>
                    </div>
                </div>
            </motion.div>

            {/* Profile Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-8"
            >
                <h2 className="text-2xl font-bold mb-6">Profile Information</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Full Name
                        </label>
                        <div className="relative">
                            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                className="input-field pl-12"
                                placeholder="Enter your full name"
                            />
                        </div>
                    </div>

                    {/* Email (Read-only) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                disabled
                                className="input-field pl-12 opacity-60 cursor-not-allowed"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    {/* Save Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <FaSave />
                                Save Changes
                            </>
                        )}
                    </button>
                </form>
            </motion.div>

            {/* Account Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-8"
            >
                <h2 className="text-2xl font-bold mb-6">Account Statistics</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-white/5 rounded-lg">
                        <p className="text-gray-400 text-sm mb-1">Member Since</p>
                        <p className="text-lg font-semibold">
                            {new Date(user?.created_at).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>

                    <div className="p-4 bg-white/5 rounded-lg">
                        <p className="text-gray-400 text-sm mb-1">Account Status</p>
                        <p className="text-lg font-semibold text-green-400">Active</p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default Profile
