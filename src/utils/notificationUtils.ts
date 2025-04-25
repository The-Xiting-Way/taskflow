
export const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'assignment':
      return '📋';
    case 'update-request':
      return '📝';
    case 'completion':
      return '✅';
    default:
      return '🔔';
  }
};

export const getNotificationColor = (type: string): string => {
  switch (type) {
    case 'assignment':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'update-request':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'completion':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};
