import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import TaskList from './components/TaskList';
import AddTaskModal from './components/AddTaskModal';
import { Task } from './types/Task';
import { loadTasks, saveTasks } from './utils/localStorage';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    const savedTasks = loadTasks();
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setTasks(prev => [newTask, ...prev]);
    setIsAddModalOpen(false);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleComplete = (id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed, completedAt: !task.completed ? new Date() : undefined }
          : task
      )
    );
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const pendingCount = tasks.filter(task => !task.completed).length;
  const completedCount = tasks.filter(task => task.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Tasks</h1>
              <p className="text-gray-600 mt-1">
                {pendingCount} pending, {completedCount} completed
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-gray-100/80 rounded-2xl p-1">
            {[
              { key: 'all', label: 'All', count: tasks.length },
              { key: 'pending', label: 'Pending', count: pendingCount },
              { key: 'completed', label: 'Completed', count: completedCount },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key as typeof filter)}
                className={`flex-1 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  filter === key
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                {label} {count > 0 && <span className="ml-1 text-xs opacity-70">({count})</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <TaskList
          tasks={filteredTasks}
          onToggleComplete={toggleComplete}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
        />

        {filteredTasks.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
            </h3>
            <p className="text-gray-600 mb-8">
              {filter === 'all' 
                ? 'Get started by creating your first task'
                : `You have no ${filter} tasks at the moment`
              }
            </p>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group z-50"
        aria-label="Add new task"
      >
        <Plus className="w-7 h-7 group-hover:scale-110 transition-transform duration-200" />
      </button>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTask={addTask}
      />
    </div>
  );
}

export default App;