import logo from '../public/images/logo.jpg'

export function Logo() {
  return (
    <div className="flex items-center justify-center">
      <div
        className="h-16 w-16 bg-white rounded-full flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${logo.src})`
        }}>
        </div>
    </div>
  )
}
