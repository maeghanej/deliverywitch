import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-primary">
            DeliveryWitch
          </Link>
          <div className="flex space-x-4">
            <Link
              to="/quests"
              className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
            >
              Quests
            </Link>
            <Link
              to="/profile"
              className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
            >
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 