
export default function Features({ description, children, logo, color }: { description: string, children: React.ReactNode, logo: React.ReactNode, color: string }) {
    return (
        <button className="p-4 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-red-400 hover:bg-red-50 transition-all duration-300 flex flex-col items-center gap-2 group">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 ${color}`}>
                {logo}
            </div>
            <span className="text-sm font-semibold text-gray-700">{description}</span>
            {/* Probably a popover component*/}
            {children}
        </button>
    )
}
