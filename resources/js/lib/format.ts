/**
 * Format a duration in seconds as a string in the format HH:MM:SS.
 *
 * Examples of formatted output:
 * - 83 seconds -> "1:23"
 * - 754 seconds -> "12:34"
 * - 3754 seconds -> "1:02:34"
 *
 * @param {number} seconds The duration in seconds.
 * @returns {string} The formatted string.
 */
export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedMinutes = hours > 0 ? String(minutes).padStart(2, '0') : String(minutes);
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return hours > 0
    ? `${hours}:${formattedMinutes}:${formattedSeconds}`
    : `${formattedMinutes}:${formattedSeconds}`;
}

export function formatNumber(numbers: number): string {
  return Intl.NumberFormat('en', { notation: 'compact', compactDisplay: 'short' }).format(numbers);
}
