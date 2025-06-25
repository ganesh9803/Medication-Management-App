// src/components/patient/AdherenceSummaryCard/index.jsx
export default function AdherenceSummaryCard({ analytics }) {
  if (!analytics) return null;

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-3xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-6 flex items-center gap-2">
        📊 <span>Adherence Summary</span>
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
        <div className="bg-blue-50 dark:bg-blue-900 rounded-2xl py-4 shadow-inner">
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-300">{analytics.adherenceRate}%</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">Adherence Rate</p>
        </div>

        <div className="bg-green-50 dark:bg-green-900 rounded-2xl py-4 shadow-inner">
          <p className="text-3xl font-bold text-green-600 dark:text-green-300">{analytics.currentStreak}</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">Current Streak</p>
        </div>

        <div className="bg-indigo-50 dark:bg-indigo-900 rounded-2xl py-4 shadow-inner">
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-300">{analytics.takenThisWeek}</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">Taken This Week</p>
        </div>

        <div className="bg-red-50 dark:bg-red-900 rounded-2xl py-4 shadow-inner">
          <p className="text-3xl font-bold text-red-500 dark:text-red-300">{analytics.missedThisMonth}</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">Missed This Month</p>
        </div>
      </div>

      <div className="mt-8 border-t pt-6">
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">📅 Monthly Progress</p>
        <div className="flex flex-wrap gap-4 text-sm font-medium">
          <span className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 px-3 py-1 rounded-full shadow-sm">
            ✅ Taken: {analytics.monthlyProgress.taken} days
          </span>
          <span className="bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100 px-3 py-1 rounded-full shadow-sm">
            ❌ Missed: {analytics.monthlyProgress.missed} days
          </span>
          <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100 px-3 py-1 rounded-full shadow-sm">
            ⏳ Remaining: {analytics.monthlyProgress.remaining} days
          </span>
        </div>
      </div>
    </div>
  );
}
