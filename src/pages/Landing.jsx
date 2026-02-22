import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaRocket, FaShieldAlt, FaBolt, FaStar, FaCheckCircle } from 'react-icons/fa'
import { useProducts } from '../context/ProductContext'
import { useState, useEffect } from 'react'
import ProductCard from '../components/products/ProductCard'
import ProductDetailsModal from '../components/products/ProductDetailsModal'
import Footer from '../components/layout/Footer'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useSettings } from '../context/SettingsContext'

const Landing = () => {
    const { products } = useProducts()
    const { user } = useAuth()
    const { settings } = useSettings()
    const navigate = useNavigate()
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)

    const handleBuyClick = (product) => {
        setSelectedProduct(product)
        setIsDetailsOpen(true)
    }

    const handleProceedToPayment = (product) => {
        setIsDetailsOpen(false)
        if (!user) {
            navigate('/login')
        } else {
            navigate('/dashboard')
        }
    }

    const features = [
        {
            icon: <FaRocket />,
            title: 'Premium Digital Products',
            description: 'Access high-quality APKs, courses, and digital files curated for your success'
        },
        {
            icon: <FaShieldAlt />,
            title: 'Secure Payments',
            description: 'Multiple payment options including manual and automated Razorpay integration'
        },
        {
            icon: <FaBolt />,
            title: 'Instant Download',
            description: 'Get immediate access to your purchased products after payment approval'
        },
        {
            icon: <FaStar />,
            title: '24/7 Support',
            description: 'Dedicated support team ready to help you with any questions or issues'
        }
    ]

    const testimonials = [
        {
            name: 'Rajesh Kumar',
            role: 'Developer',
            avatar: '👨‍💻',
            content: 'Amazing platform! Got instant access to premium development courses. Highly recommended!'
        },
        {
            name: 'Priya Sharma',
            role: 'Designer',
            avatar: '👩‍🎨',
            content: 'The UI templates I purchased saved me weeks of work. Worth every rupee!'
        },
        {
            name: 'Arjun Patel',
            role: 'Entrepreneur',
            avatar: '👨‍💼',
            content: 'Secure payment process and excellent product quality. My go-to digital marketplace!'
        }
    ]

    return (
        <div className="min-h-screen relative overflow-hidden selection:bg-blue-500/30">

            <div className="mesh-bg" />
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse-slow" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse-slow" />


            <nav className="glass-nav border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/" className="text-2xl font-bold gradient-text">
                            {settings.site_name}
                        </Link>

                        <div className="flex items-center gap-4">
                            {user ? (
                                <Link to="/dashboard" className="btn-primary text-sm py-2">
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link to="/login" className="btn-secondary text-sm py-2">
                                        Login
                                    </Link>
                                    <Link to="/signup" className="btn-primary text-sm py-2">
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>


            <section className="pt-32 pb-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center relative">

                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl z-0"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative z-10"
                        >
                            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tight">
                                Ignite Your <span className="gradient-text">Digital Era</span>
                                <br />
                                with {settings.site_name}
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                                The ultimate destination for premium digital assets. Hand-picked courses,
                                expert-grade applications, and elite resources for digital mastery.
                            </p>

                            <div className="flex items-center justify-center gap-4">
                                {user ? (
                                    <Link to="/dashboard" className="btn-primary text-lg py-4 px-8">
                                        Go to Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link to="/signup" className="btn-primary text-lg py-4 px-8">
                                            Get Started
                                        </Link>
                                        <Link to="/login" className="btn-secondary text-lg py-4 px-8">
                                            Sign In
                                        </Link>
                                    </>
                                )}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto"
                        >
                            <div className="glass-card p-8 border-b-4 border-b-blue-500">
                                <h3 className="text-5xl font-black text-white mb-2">120+</h3>
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Premium Assets</p>
                            </div>
                            <div className="glass-card p-8 border-b-4 border-b-purple-500">
                                <h3 className="text-5xl font-black text-white mb-2">8K+</h3>
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Active Elite Users</p>
                            </div>
                            <div className="glass-card p-8 border-b-4 border-b-pink-500">
                                <h3 className="text-5xl font-black text-white mb-2">Instant</h3>
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Digital Delivery</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>


            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            Why Choose <span className="gradient-text">{settings.site_name}</span>?
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            We provide the best digital marketplace experience with cutting-edge features
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                viewport={{ once: true }}
                                className="glass-card p-6 hover:scale-105 transition-transform duration-300"
                            >
                                <div className="text-4xl text-blue-400 mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                                <p className="text-gray-400">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>


            <section className="py-20 px-4 bg-slate-900/30">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            Featured <span className="gradient-text">Products</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Check out our latest and most popular digital products
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.slice(0, 3).map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                viewport={{ once: true }}
                            >
                                <ProductCard product={product} onBuyClick={handleBuyClick} />
                            </motion.div>
                        ))}
                    </div>

                    {products.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-400 text-lg">No products available yet. Check back soon!</p>
                        </div>
                    )}
                </div>
            </section>


            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            What Our <span className="gradient-text">Customers Say</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Join thousands of satisfied customers who trust {settings.site_name}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                viewport={{ once: true }}
                                className="glass-card p-6"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="text-4xl">{testimonial.avatar}</div>
                                    <div>
                                        <h4 className="font-semibold text-white">{testimonial.name}</h4>
                                        <p className="text-sm text-gray-400">{testimonial.role}</p>
                                    </div>
                                </div>
                                <p className="text-gray-300 italic">"{testimonial.content}"</p>
                                <div className="flex gap-1 mt-4 text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} />
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>


            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="glass-card p-12 text-center"
                    >
                        <h2 className="text-4xl font-bold mb-4">
                            Ready to Get Started?
                        </h2>
                        <p className="text-gray-400 text-lg mb-8">
                            Join {settings.site_name} today and access premium digital products instantly
                        </p>
                        {user ? (
                            <Link to="/dashboard" className="btn-primary text-lg py-4 px-8">
                                Go to Dashboard
                            </Link>
                        ) : (
                            <Link to="/signup" className="btn-primary text-lg py-4 px-8">
                                Create Free Account
                            </Link>
                        )}
                    </motion.div>
                </div>
            </section>

            <Footer />


            <ProductDetailsModal
                product={selectedProduct}
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                onProceed={handleProceedToPayment}
            />
        </div>
    )
}

export default Landing
