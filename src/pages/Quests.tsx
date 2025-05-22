const Quests = () => {
  const sampleQuests = [
    {
      id: 1,
      title: "The Missing Potion",
      description: "Deliver a mysterious potion to the local park",
      distance: "0.5km",
      reward: "50 magic points",
      difficulty: "Easy"
    },
    {
      id: 2,
      title: "Enchanted Package",
      description: "Transport an enchanted package to the nearest cafe",
      distance: "1.2km",
      reward: "100 magic points",
      difficulty: "Medium"
    }
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Available Quests
      </h1>
      <div className="grid gap-4">
        {sampleQuests.map((quest) => (
          <div
            key={quest.id}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2 text-primary">
              {quest.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {quest.description}
            </p>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Distance: {quest.distance}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                Reward: {quest.reward}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                Difficulty: {quest.difficulty}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Quests 