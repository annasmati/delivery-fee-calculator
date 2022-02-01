/**
 * Returns a new {@link Date} object with current date and time (UTC)
 * @returns {Date}
 */
const getCurrentTimeAndDate = (): Date => {
  const date: Date = new Date();
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes()
  );
};

export default getCurrentTimeAndDate;
