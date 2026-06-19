
export function InputField({ children, className }) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {children}
    </div>
  )
}

