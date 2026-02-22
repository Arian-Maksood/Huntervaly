import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { useSettings } from '../context/SettingsContext'

const Signup = () => {
    const navigate = useNavigate()
    const { signUp } = useAuth()
    const { settings } = useSettings()
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters')
            return
        }

        setLoading(true)

        const { success } = await signUp(formData.email, formData.password, formData.fullName)

        if (success) {
            navigate('/login')
        }

        setLoading(false)
    }

    // Password strength indicator
    const getPasswordStrength = () => {
        const password = formData.password
        if (password.length === 0) return null
        if (password.length < 6) return { text: 'Weak', color: 'text-red-400' }
        if (password.length < 10) return { text: 'Medium', color: 'text-yellow-400' }
        return { text: 'Strong', color: 'text-green-400' }
    }

    const passwordStrength = getPasswordStrength()

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden selection:bg-blue-500/30">
            {/* Background Decoration */}
            <div className="mesh-bg" />
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 blur-[150px] rounded-full animate-mesh" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 blur-[150px] rounded-full animate-mesh" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-lg relative z-10 py-12"
            >
                <div className="glass-card p-12 border-t border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    {/* Logo/Brand */}
                    <div className="text-center mb-10">
                        <Link to="/" className="inline-block mb-4">
                            <h1 className="text-5xl font-black gradient-text tracking-tighter">
                                {settings.site_name}
                            </h1>
                        </Link>
                        <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
                        <p className="text-slate-500 font-medium">Join the elite community of {settings.site_name}</p>
                    </div>

                    {/* Signup Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    className="input-field pl-12"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        {/* Email */}
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
                                    onChange={handleChange}
                                    required
                                    className="input-field pl-12"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="input-field pl-12 pr-12"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {passwordStrength && (
                                <p className={`text-sm mt-1 ${passwordStrength.color}`}>
                                    Password strength: {passwordStrength.text}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className="input-field pl-12 pr-12"
                                    placeholder="Confirm your password"
                                />
                                {formData.confirmPassword && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        {formData.password === formData.confirmPassword ? (
                                            <FaCheckCircle className="text-green-400" />
                                        ) : (
                                            <FaTimesCircle className="text-red-400" />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-4 text-lg"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    <span>Creating Account...</span>
                                </div>
                            ) : (
                                `Join ${settings.site_name} Elite`
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-400">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    {/* Back to Home */}
                    <div className="mt-4 text-center">
                        <Link to="/" className="text-gray-500 hover:text-gray-400 text-sm transition-colors">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default Signup
