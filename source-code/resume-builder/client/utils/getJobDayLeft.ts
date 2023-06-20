export const getJobDayLeft = (jobDeadline: Date) => {
  const currentTime = new Date();
  const deadline = new Date(jobDeadline);

  const diffInMs = deadline.getTime() - currentTime.getTime();

  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  return Math.floor(diffInDays);
};
