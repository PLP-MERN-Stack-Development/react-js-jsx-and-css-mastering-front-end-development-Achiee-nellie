import React, { useState, useEffect } from 'react';

/**
 * Custom hook for managing tasks with localStorage persistence
 */
const useLocalStorageTasks = () => {
  // Initialize state from localStorage or with empty array
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  // Update localStorage when tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Add a new task
  const addTask = (text) => {
    if (text.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text,
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  };

  // Toggle task completion status
  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return { tasks, addTask, toggleTask, deleteTask };
};

/**
 * TaskManager component for managing tasks
 */
const TaskManager = () => {
  const { tasks, addTask, toggleTask, deleteTask } = useLocalStorageTasks();
  const [newTaskText, setNewTaskText] = useState('');
  const [filter, setFilter] = useState('all');

  // Filter tasks based on selected filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true; // 'all' filter
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    addTask(newTaskText);
    setNewTaskText('');
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Task Manager</h2>

      {/* Task input form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </form>

      {/* Filter buttons */}
      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            filter === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700'
          }`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded ${
            filter === 'active'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700'
          }`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={`px-4 py-2 rounded ${
            filter === 'completed'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700'
          }`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      {/* Task list */}
      <ul className="space-y-2">
        {filteredTasks.length === 0 ? (
          <li className="text-gray-500 dark:text-gray-400 text-center py-4">
            No tasks found
          </li>
        ) : (
          filteredTasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-2 p-2 border rounded"
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="h-4 w-4"
              />
              <span className={task.completed ? 'line-through' : ''}>
                {task.text}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="ml-auto px-2 py-1 text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TaskManager;