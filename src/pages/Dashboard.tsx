import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../hooks/useTasks';
import { useNotifications } from '../hooks/useNotifications';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import type { Task } from '../lib/supabase';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';

export const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { tasks, loading: tasksLoading, error: tasksError, getTasks } = useTasks();
  const { notifications, loading: notificationsLoading, fetchNotifications } = useNotifications();

  useEffect(() => {
    getTasks();
    fetchNotifications();
  }, [getTasks, fetchNotifications]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Successfully signed out');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  if (tasksLoading || notificationsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (tasksError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error loading tasks: {tasksError}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={user?.avatar_url || undefined} />
                  <AvatarFallback>
                    {user?.full_name?.[0] || user?.email?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{user?.full_name || 'User'}</p>
                  <p className="text-gray-500">{user?.email}</p>
                </div>
              </div>
              <Button onClick={handleSignOut} variant="outline">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <p className="text-gray-500">No tasks found</p>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 bg-white rounded-lg shadow"
                    >
                      <h3 className="font-semibold">{task.title}</h3>
                      <p className="text-sm text-gray-500">{task.description}</p>
                      <div className="mt-2 flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          task.status === 'TODO'
                            ? 'bg-yellow-100 text-yellow-800'
                            : task.status === 'IN_PROGRESS'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {task.status}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          task.priority === 'LOW'
                            ? 'bg-gray-100 text-gray-800'
                            : task.priority === 'MEDIUM'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <p className="text-gray-500">No notifications</p>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 bg-white rounded-lg shadow ${
                        !notification.read ? 'border-l-4 border-blue-500' : ''
                      }`}
                    >
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
