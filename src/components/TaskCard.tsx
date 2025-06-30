import React, { useState } from 'react';
import { 
  Check, 
  Clock, 
  Calendar, 
  Edit3, 
  Trash2, 
  Flag,
  Tag,
  MoreVertical 
} from 'lucide-react';
import { Task } from '../types/Task';
import EditTaskModal from './EditTaskModal';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <>
      <div className={`group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border transition-all duration-200 hover:shadow-lg hover:shadow-indigo-100/50 hover:-translate-y-0.5 ${
        task.completed 
          ? 'border-green-200/50 bg-green-50/30' 
          : isOverdue 
            ? 'border-red-200/50 bg-red-50/30'
            : 'border-gray-200/50 hover:border-indigo-200/50'
      }`}>
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <button
            onClick={() => onToggleComplete(task.id)}
            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
              task.completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
            }`}
          >
            {task.completed && <Check className="w-4 h-4" />}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className={`font-semibold text-lg leading-tight mb-2 ${
                  task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                }`}>
                  {task.title}
                </h3>
                
                {task.description && (
                  <p className={`text-sm mb-3 leading-relaxed ${
                    task.completed ? 'line-through text-gray-400' : 'text-gray-600'
                  }`}>
                    {task.description}
                  </p>
                )}

                {/* Tags */}
                {task.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {task.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Date and Time */}
                <div className="flex items-center gap-4 text-sm">
                  {task.dueDate && (
                    <div className={`flex items-center gap-1 ${
                      isOverdue ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(new Date(task.dueDate))}</span>
                    </div>
                  )}
                  
                  {task.dueTime && (
                    <div className={`flex items-center gap-1 ${
                      isOverdue ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(task.dueTime)}</span>
                    </div>
                  )}
                  
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    <Flag className="w-3 h-3" />
                    <span className="capitalize">{task.priority}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                  aria-label="Edit task"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  aria-label="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Completion timestamp */}
        {task.completed && task.completedAt && (
          <div className="mt-4 pt-4 border-t border-green-200/50">
            <p className="text-xs text-green-600">
              Completed on {formatDate(task.completedAt)} at {formatTime(task.completedAt.toTimeString().slice(0, 5))}
            </p>
          </div>
        )}
      </div>

      <EditTaskModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        task={task}
        onUpdateTask={onUpdateTask}
      />
    </>
  );
};

export default TaskCard;