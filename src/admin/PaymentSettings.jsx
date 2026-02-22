import { useState, useEffect } from 'react'
import { paymentService } from '../services/payments'
import { motion } from 'framer-motion'
import { FaSave, FaCreditCard, FaMoneyBillWave, FaGlobe } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { useSettings } from '../context/SettingsContext'

const PaymentSettings = () => {
    const { updateSiteName, fetchSettings: refreshGlobalSettings } = useSettings()
    const [settings, setSettings] = useState({
        site_name: '',
        manual_payment_enabled: true,
        manual_payment_instructions: '',
        razorpay_enabled: false
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            setLoading(true)
            const { data, error } = await paymentService.getPaymentSettings()

            if (!error && data) {
                setSettings({
                    site_name: data.site_name ?? 'HUNTER VALY',
                    manual_payment_enabled: data.manual_payment_enabled ?? true,
                    manual_payment_instructions: data.manual_payment_instructions ?? '',
                    razorpay_enabled: data.razorpay_enabled ?? false
                })
            }
        } catch (error) {
            console.error('Error fetching settings:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)

        try {
            // Save each setting
            await paymentService.updatePaymentSettings('site_name', settings.site_name)
            await paymentService.updatePaymentSettings('manual_payment_enabled', settings.manual_payment_enabled)
            await paymentService.updatePaymentSettings('manual_payment_instructions', settings.manual_payment_instructions)
            await paymentService.updatePaymentSettings('razorpay_enabled', settings.razorpay_enabled)

            // Update global settings context
            await refreshGlobalSettings()

            toast.success('Settings saved successfully')
        } catch (error) {
            toast.error('Failed to save settings')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="glass-card p-6">
                <h1 className="text-3xl font-bold gradient-text mb-2">Site Settings</h1>
                <p className="text-gray-400">Configure global site options and payments</p>
            </div>

            {/* Site Configuration */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-green-500/20 rounded-lg">
                        <FaGlobe className="text-2xl text-green-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">General Configuration</h2>
                        <p className="text-gray-400">Configure core site details</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Site Name
                        </label>
                        <input
                            type="text"
                            value={settings.site_name}
                            onChange={(e) => setSettings(prev => ({ ...prev, site_name: e.target.value }))}
                            className="input-field w-full"
                            placeholder="e.g. Huntervaly"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            This name will be displayed across the entire platform
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Manual Payment Settings */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                        <FaMoneyBillWave className="text-2xl text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Manual Payment</h2>
                        <p className="text-gray-400">Configure manual payment process</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Enable/Disable Toggle */}
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div>
                            <h3 className="font-semibold mb-1">Enable Manual Payments</h3>
                            <p className="text-sm text-gray-400">Allow users to pay manually via Bkash or Nagad</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.manual_payment_enabled}
                                onChange={(e) => setSettings(prev => ({ ...prev, manual_payment_enabled: e.target.checked }))}
                                className="sr-only peer"
                            />
                            <div className="w-14 h-7 bg-gray-700 peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    {/* Payment Instructions */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Payment Instructions
                        </label>
                        <textarea
                            value={settings.manual_payment_instructions}
                            onChange={(e) => setSettings(prev => ({ ...prev, manual_payment_instructions: e.target.value }))}
                            rows={6}
                            className="input-field w-full resize-none"
                            placeholder="Enter instructions for users making manual payments. Include:&#10;- Bank account details&#10;- Bkash Number&#10;- QR code instructions&#10;- Payment confirmation steps"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            These instructions will be shown to users when they choose manual payment
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Razorpay Settings */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-purple-500/20 rounded-lg">
                        <FaCreditCard className="text-2xl text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Razorpay Integration</h2>
                        <p className="text-gray-400">Configure automated payment gateway</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Enable/Disable Toggle */}
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div>
                            <h3 className="font-semibold mb-1">Enable Razorpay</h3>
                            <p className="text-sm text-gray-400">Allow automated payments via Razorpay gateway</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.razorpay_enabled}
                                onChange={(e) => setSettings(prev => ({ ...prev, razorpay_enabled: e.target.checked }))}
                                className="sr-only peer"
                            />
                            <div className="w-14 h-7 bg-gray-700 peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                    </div>

                    {/* Info Box */}
                    <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                        <h4 className="font-semibold mb-2 text-purple-300">Razorpay Configuration</h4>
                        <p className="text-sm text-gray-400 mb-3">
                            To enable Razorpay payments, you need to configure your Razorpay credentials in the environment variables:
                        </p>
                        <div className="bg-black/30 p-3 rounded font-mono text-sm">
                            <p className="text-green-400"># Add to .env file:</p>
                            <p className="text-gray-300">VITE_RAZORPAY_KEY_ID=your_razorpay_key_id</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-3">
                            Get your Razorpay credentials from: <a href="https://dashboard.razorpay.com/app/keys" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">Razorpay Dashboard</a>
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Save Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {saving ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                            Saving...
                        </>
                    ) : (
                        <>
                            <FaSave />
                            Save Settings
                        </>
                    )}
                </button>
            </motion.div>
        </div>
    )
}

export default PaymentSettings
