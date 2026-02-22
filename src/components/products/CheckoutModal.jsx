import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaRupeeSign, FaImage, FaUpload, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'
import { paymentService } from '../../services/payments'
import { supabase } from '../../services/supabase'
import toast from 'react-hot-toast'

const CheckoutModal = ({ product, user, isOpen, onClose, onSuccess }) => {
    const [step, setStep] = useState(1) // 1: Method Choice, 2: Manual Form, 3: Success
    const [settings, setSettings] = useState(null)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        utr_number: '',
        screenshot: null
    })

    useEffect(() => {
        if (isOpen) {
            fetchSettings()
            setStep(1)
        }
    }, [isOpen])

    const fetchSettings = async () => {
        const { data, error } = await paymentService.getPaymentSettings()
        if (!error) setSettings(data)
    }

    const handleFormChange = (e) => {
        if (e.target.name === 'screenshot') {
            setFormData(prev => ({ ...prev, screenshot: e.target.files[0] }))
        } else {
            setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
        }
    }

    const handleManualSubmit = async (e) => {
        e.preventDefault()
        if (!formData.screenshot) return toast.error('Please upload payment screenshot')
        if (!formData.utr_number) return toast.error('Please enter UTR number')

        setLoading(true)
        try {
            // 1. Submit Order
            const { data: order, error: orderError } = await paymentService.submitManualPayment({
                user_id: user.id,
                product_id: product.id,
                amount: product.price,
                utr_number: formData.utr_number
            })

            if (orderError) throw new Error(orderError)

            // 2. Upload Screenshot
            const { url, error: uploadError } = await paymentService.uploadPaymentScreenshot(
                formData.screenshot,
                order.id
            )

            if (uploadError) throw new Error(uploadError)

            // 3. Update Order with screenshot URL
            const { error: updateError } = await supabase
                .from('orders')
                .update({ screenshot_url: url })
                .eq('id', order.id)

            if (updateError) throw new Error(updateError.message)

            setStep(3)
            toast.success('Payment submitted for verification!')
            if (onSuccess) onSuccess()
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    if (!product || !user) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-xl glass-card p-8"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                        >
                            <FaTimes />
                        </button>

                        {/* Order Summary */}
                        <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">Buying Product</p>
                                <h4 className="font-bold text-white">{product.title}</h4>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-400">Total Amount</p>
                                <p className="text-xl font-bold text-green-400">₹{product.price}</p>
                            </div>
                        </div>

                        {/* Step Content */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-center">Choose Payment Method</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {settings?.manual_payment_enabled && (
                                        <button
                                            onClick={() => setStep(2)}
                                            className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-orange-500/20 rounded-xl">
                                                    <FaImage className="text-orange-400 text-xl" />
                                                </div>
                                                <div className="text-left">
                                                    <h4 className="font-bold">Manual Payment</h4>
                                                    <p className="text-sm text-gray-400">UPI/Bank Transfer (Screenshoot Req.)</p>
                                                </div>
                                            </div>
                                            <div className="w-6 h-6 border-2 border-white/20 rounded-full group-hover:border-blue-500 transition-colors" />
                                        </button>
                                    )}

                                    {settings?.razorpay_enabled && (
                                        <button className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between opacity-50 cursor-not-allowed">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-blue-500/20 rounded-xl">
                                                    <FaRupeeSign className="text-blue-400 text-xl" />
                                                </div>
                                                <div className="text-left">
                                                    <h4 className="font-bold">Razorpay (Auto)</h4>
                                                    <p className="text-sm text-gray-400">Support coming soon</p>
                                                </div>
                                            </div>
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <form onSubmit={handleManualSubmit} className="space-y-6 animate-fade-in">
                                <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/30">
                                    <h4 className="flex items-center gap-2 text-blue-300 font-semibold mb-2">
                                        <FaExclamationTriangle /> Instructions
                                    </h4>
                                    <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                                        {settings?.manual_payment_instructions || 'Please contact admin for payment instructions.'}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">UTR Number / Transaction ID</label>
                                    <input
                                        type="text"
                                        name="utr_number"
                                        value={formData.utr_number}
                                        onChange={handleFormChange}
                                        required
                                        className="input-field"
                                        placeholder="Enter 12-digit UTR number"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Payment Screenshot</label>
                                    <div className="relative border-2 border-dashed border-white/20 rounded-xl p-8 hover:border-blue-500/50 transition-colors text-center">
                                        <input
                                            type="file"
                                            name="screenshot"
                                            onChange={handleFormChange}
                                            required
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <FaUpload className="mx-auto text-3xl text-gray-500 mb-2" />
                                        <p className="text-sm text-gray-400">
                                            {formData.screenshot ? formData.screenshot.name : 'Click to upload screenshot'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="flex-1 btn-secondary"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-[2] btn-primary py-4"
                                    >
                                        {loading ? 'Submitting...' : 'Submit Payment'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {step === 3 && (
                            <div className="text-center py-8 animate-scale-in">
                                <FaCheckCircle className="text-8xl text-green-500 mx-auto mb-6" />
                                <h3 className="text-3xl font-bold mb-4">Awesome!</h3>
                                <p className="text-gray-400 text-lg mb-8">
                                    We've received your payment submission. Our team will verify it shortly. You can track your order status in your dashboard.
                                </p>
                                <button onClick={onClose} className="btn-primary w-full py-4">
                                    Close and Go Back
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export default CheckoutModal
