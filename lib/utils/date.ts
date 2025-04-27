export default function formatDateTime(date: Date) {
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  return new Date(date).toLocaleString("en-US", options);
};

export function formatDate(date: Date) {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  return new Date(date).toLocaleString("en-US", options);
};

export function formatTime(date: Date) {
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  return new Date(date).toLocaleString("en-US", options);
};

export function formatTimeAgo(date: Date) {
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  return new Date(date).toLocaleString("en-US", options);
};

export function isOverdue(date: Date, status?: string) {
  const currentDate = new Date();
  return currentDate > new Date(date) && status !== "Completed";
};

export function isUpcoming(date: Date, status?: string) {
  const dueDate = new Date(date);
  const now = new Date();
  const diffTime = dueDate.getTime() - now.getTime();
  const diffHours = diffTime / (1000 * 60 * 60);
  return diffHours > 0 && diffHours < 48 && status !== "Completed";
};

export function getDaysRemaining(date: Date) {
  const deadlineDate = new Date(date);
  const currentDate = new Date();
  return Math.ceil(
    (deadlineDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
  );
};
