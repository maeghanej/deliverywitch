const Profile = () => {
  const userProfile = {
    name: "Apprentice Witch",
    level: 5,
    experience: 450,
    totalQuests: 12,
    magicPoints: 600,
    achievements: [
      "First Delivery",
      "Speed Runner",
      "Early Bird"
    ]
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          {userProfile.name}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {userProfile.level}
            </div>
            <div className="text-gray-600 dark:text-gray-300">Level</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-secondary">
              {userProfile.totalQuests}
            </div>
            <div className="text-gray-600 dark:text-gray-300">Quests Completed</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-accent">
              {userProfile.magicPoints}
            </div>
            <div className="text-gray-600 dark:text-gray-300">Magic Points</div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {userProfile.achievements.map((achievement, index) => (
            <div
              key={index}
              className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <span className="text-yellow-500 mr-2">🏆</span>
              <span className="text-gray-700 dark:text-gray-300">
                {achievement}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Profile 