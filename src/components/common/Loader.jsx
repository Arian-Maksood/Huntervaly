const Loader = ({ size = 'default' }) => {
    const sizeClasses = {
        small: 'h-6 w-6',
        default: 'h-12 w-12',
        large: 'h-16 w-16'
    }

    return (
        <div className="flex items-center justify-center">
            <div className={`animate-spin rounded-full border-t-2 border-b-2 border-blue-500 ${sizeClasses[size]}`}></div>
        </div>
    )
}

export const FullPageLoader = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="text-center">
                <Loader size="large" />
                <p className="mt-4 text-white/60">Loading...</p>
            </div>
        </div>
    )
}

export default Loader
