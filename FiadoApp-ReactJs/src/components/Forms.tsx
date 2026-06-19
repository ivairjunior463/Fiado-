
function AuthForm({ children, className }) {
    return (
        <form typeof="" className={`
            flex 
            flex-col
            gap-5
            p-5 
            border
            border-zinc-500
            rounded-xl
            ${className}
            `}
        >
            {children}
        </form>
    )
}

export default AuthForm