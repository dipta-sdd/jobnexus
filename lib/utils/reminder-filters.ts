import { Reminder } from "@/lib/types";

export const filterReminders = (
  reminders: Reminder[],
  filter: string,
  statusFilter: string
): Reminder[] => {
  const today = new Date();
  let filteredReminders = [...reminders];

  // Filter by date range
  switch (filter) {
    case 'all':
      // Keep all reminders
      break;
    case 'today':
      filteredReminders = filteredReminders.filter(reminder => {
        const dueDate = new Date(reminder.dueDate);
        return dueDate.toDateString() === today.toDateString();
      });
      break;
    case 'tomorrow':
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      filteredReminders = filteredReminders.filter(reminder => {
        const dueDate = new Date(reminder.dueDate);
        return dueDate.toDateString() === tomorrow.toDateString();
      });
      break;
    case 'thisweek':
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
      filteredReminders = filteredReminders.filter(reminder => {
        const dueDate = new Date(reminder.dueDate);
        return dueDate >= today && dueDate <= endOfWeek;
      });
      break;
    case 'nextweek':
      const startOfNextWeek = new Date(today);
      startOfNextWeek.setDate(today.getDate() + (7 - today.getDay()) + 1);
      const endOfNextWeek = new Date(startOfNextWeek);
      endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);
      filteredReminders = filteredReminders.filter(reminder => {
        const dueDate = new Date(reminder.dueDate);
        return dueDate >= startOfNextWeek && dueDate <= endOfNextWeek;
      });
      break;
    case 'thismonth':
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      filteredReminders = filteredReminders.filter(reminder => {
        const dueDate = new Date(reminder.dueDate);
        return dueDate >= today && dueDate <= endOfMonth;
      });
      break;
    case 'nextmonth':
      const startOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      const endOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);
      filteredReminders = filteredReminders.filter(reminder => {
        const dueDate = new Date(reminder.dueDate);
        return dueDate >= startOfNextMonth && dueDate <= endOfNextMonth;
      });
      break;
    case 'thisyear':
      const endOfYear = new Date(today.getFullYear(), 11, 31);
      filteredReminders = filteredReminders.filter(reminder => {
        const dueDate = new Date(reminder.dueDate);
        return dueDate >= today && dueDate <= endOfYear;
      });
      break;
    case 'nextyear':
      const startOfNextYear = new Date(today.getFullYear() + 1, 0, 1);
      const endOfNextYear = new Date(today.getFullYear() + 1, 11, 31);
      filteredReminders = filteredReminders.filter(reminder => {
        const dueDate = new Date(reminder.dueDate);
        return dueDate >= startOfNextYear && dueDate <= endOfNextYear;
      });
      break;
    case 'upcoming':
      filteredReminders = filteredReminders.filter(reminder => 
        new Date(reminder.dueDate) > today
      );
      break;
    case 'upcoming7days':
      const sevenDaysFromNow = new Date(today);
      sevenDaysFromNow.setDate(today.getDate() + 7);
      filteredReminders = filteredReminders.filter(reminder => {
        const dueDate = new Date(reminder.dueDate);
        return dueDate > today && dueDate <= sevenDaysFromNow;
      });
      break;
    case 'upcoming30days':
      const thirtyDaysFromNow = new Date(today);
      thirtyDaysFromNow.setDate(today.getDate() + 30);
      filteredReminders = filteredReminders.filter(reminder => {
        const dueDate = new Date(reminder.dueDate);
        return dueDate > today && dueDate <= thirtyDaysFromNow;
      });
      break;
    case 'past':
      filteredReminders = filteredReminders.filter(reminder => 
        new Date(reminder.dueDate) < today
      );
      break;
    case 'past7days':
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      filteredReminders = filteredReminders.filter(reminder => {
        const dueDate = new Date(reminder.dueDate);
        return dueDate >= sevenDaysAgo && dueDate < today;
      });
      break;
    case 'past30days':
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);
      filteredReminders = filteredReminders.filter(reminder => {
        const dueDate = new Date(reminder.dueDate);
        return dueDate >= thirtyDaysAgo && dueDate < today;
      });
      break;
    default:
      break;
  }

  // Filter by status
  switch (statusFilter) {
    case 'completed':
      filteredReminders = filteredReminders.filter(reminder => 
        reminder.status === 'Completed'
      );
      break;
    case 'due':
      filteredReminders = filteredReminders.filter(reminder => 
        reminder.status !== 'Completed' && reminder.status !== 'Cancelled'
      );
      break;
    case 'cancelled':
      filteredReminders = filteredReminders.filter(reminder => 
        reminder.status === 'Cancelled'
      );
      break;
    default:
      break;
  }

  return filteredReminders;
}; 