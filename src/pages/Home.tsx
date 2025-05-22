import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
        Welcome to DeliveryWitch
      </h1>
      <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
        Embark on magical delivery quests and explore your world while staying active!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/quests"
          className="bg-primary text-white p-4 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Start New Quest
        </Link>
        <Link
          to="/profile"
          className="bg-secondary text-white p-4 rounded-lg hover:bg-secondary/90 transition-colors"
        >
          View Profile
        </Link>
      </div>
    </div>
  )
}

export default Home 