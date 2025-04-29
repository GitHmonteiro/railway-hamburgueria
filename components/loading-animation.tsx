export function LoadingAnimation() {
  return (
    <div className="relative h-16 w-16">
      <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-gray-200"></div>
      <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-t-pink-500 animate-spin"></div>
    </div>
  )
}
