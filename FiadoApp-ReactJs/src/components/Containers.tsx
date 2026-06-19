export function PageContainer({ children, className }) {
    return (
        <div className={`
            flex 
            flex-col
            p-5 
            items-center 
            justify-center
            ${className}
            `}
        >
            {children}
        </div>
    )
}

export function GenericContainer ({ children, className }) {
    return (
        <div className={`
                flex
                flex-col                
                border
                border-zinc-500                
                p-5
                ${className}
            `}
        >
            {children}
        </div>
    )
}


