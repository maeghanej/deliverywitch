import { isToday, isThisWeek, isThisMonth, startOfDay, startOfWeek, startOfMonth } from 'date-fns';

// Daily multiplier tiers
const DAILY_TIERS = [
  { completions: 1, multiplier: 1.0 },    // First quest: normal rewards
  { completions: 2, multiplier: 1.2 },    // Second quest: 20% bonus
  { completions: 3, multiplier: 1.5 },    // Third quest: 50% bonus
  { completions: 5, multiplier: 2.0 },    // Fifth quest: double rewards
  { completions: 10, multiplier: 3.0 },   // Tenth quest: triple rewards
] as const;

// Weekly streak bonuses
const WEEKLY_STREAK_BONUS = [
  { days: 3, bonus: 0.1 },  // 3 days: +10%
  { days: 5, bonus: 0.25 }, // 5 days: +25%
  { days: 7, bonus: 0.5 },  // Full week: +50%
] as const;

// Monthly streak bonuses
const MONTHLY_STREAK_BONUS = [
  { weeks: 2, bonus: 0.2 },  // 2 weeks: +20%
  { weeks: 3, bonus: 0.4 },  // 3 weeks: +40%
  { weeks: 4, bonus: 1.0 },  // Full month: +100%
] as const;

export interface StreakInfo {
  daysThisWeek: number;
  weeksThisMonth: number;
  weeklyBonus: number;
  monthlyBonus: number;
}

export interface QuestMultiplierInfo {
  currentMultiplier: number;
  questsToNextTier: number | null;
  nextTierMultiplier: number | null;
  dailyQuestsCompleted: number;
  streak: StreakInfo;
}

function calculateStreaks(completedQuests: { completedAt?: Date }[]): StreakInfo {
  const now = new Date();
  const weekStart = startOfWeek(now);
  const monthStart = startOfMonth(now);

  // Get unique days with completed quests this week
  const daysThisWeek = new Set(
    completedQuests
      .filter(q => q.completedAt && isThisWeek(q.completedAt))
      .map(q => q.completedAt!.toDateString())
  ).size;

  // Get unique weeks with completed quests this month
  const weeksThisMonth = new Set(
    completedQuests
      .filter(q => q.completedAt && isThisMonth(q.completedAt))
      .map(q => startOfWeek(q.completedAt!).toDateString())
  ).size;

  // Calculate bonuses
  const weeklyBonus = WEEKLY_STREAK_BONUS
    .filter(tier => daysThisWeek >= tier.days)
    .reduce((max, tier) => Math.max(max, tier.bonus), 0);

  const monthlyBonus = MONTHLY_STREAK_BONUS
    .filter(tier => weeksThisMonth >= tier.weeks)
    .reduce((max, tier) => Math.max(max, tier.bonus), 0);

  return {
    daysThisWeek,
    weeksThisMonth,
    weeklyBonus,
    monthlyBonus
  };
}

export function calculateQuestMultiplier(completedQuests: { completedAt?: Date }[]): QuestMultiplierInfo {
  // Calculate daily multiplier
  const dailyQuestsCompleted = completedQuests.filter(
    quest => quest.completedAt && isToday(quest.completedAt)
  ).length;

  const currentTier = [...DAILY_TIERS]
    .reverse()
    .find(tier => dailyQuestsCompleted >= tier.completions);

  const nextTier = DAILY_TIERS.find(tier => dailyQuestsCompleted < tier.completions);

  // Calculate streaks and their bonuses
  const streak = calculateStreaks(completedQuests);

  // Combine daily multiplier with streak bonuses
  const baseMultiplier = currentTier?.multiplier || 1.0;
  const totalMultiplier = baseMultiplier * (1 + streak.weeklyBonus + streak.monthlyBonus);

  return {
    currentMultiplier: totalMultiplier,
    questsToNextTier: nextTier 
      ? nextTier.completions - dailyQuestsCompleted 
      : null,
    nextTierMultiplier: nextTier?.multiplier || null,
    dailyQuestsCompleted,
    streak
  };
}

export function getMultiplierMessage(multiplierInfo: QuestMultiplierInfo): string {
  const { currentMultiplier, questsToNextTier, nextTierMultiplier, dailyQuestsCompleted, streak } = multiplierInfo;

  if (dailyQuestsCompleted === 0) {
    return "Complete your first delivery of the day!";
  }

  const currentBonus = Math.round((currentMultiplier - 1) * 100);
  let message = `${currentBonus}% bonus active!\n`;
  message += `${dailyQuestsCompleted} deliveries today\n`;
  message += `${streak.daysThisWeek}/7 days this week\n`;
  message += `${streak.weeksThisMonth}/4 weeks this month`;

  if (questsToNextTier && nextTierMultiplier) {
    const nextBonus = Math.round((nextTierMultiplier - 1) * 100);
    message += `\n${questsToNextTier} more for ${nextBonus}% daily bonus!`;
  }

  // Add streak milestone messages
  const nextWeeklyTier = WEEKLY_STREAK_BONUS.find(tier => streak.daysThisWeek < tier.days);
  if (nextWeeklyTier) {
    message += `\n${nextWeeklyTier.days - streak.daysThisWeek} more days for +${nextWeeklyTier.bonus * 100}% weekly bonus!`;
  }

  const nextMonthlyTier = MONTHLY_STREAK_BONUS.find(tier => streak.weeksThisMonth < tier.weeks);
  if (nextMonthlyTier) {
    message += `\n${nextMonthlyTier.weeks - streak.weeksThisMonth} more weeks for +${nextMonthlyTier.bonus * 100}% monthly bonus!`;
  }

  return message;
} 