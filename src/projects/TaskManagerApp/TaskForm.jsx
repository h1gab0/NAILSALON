import React, { useState } from 'react';
import { TaskInput, AddTaskButton } from './StyledComponents';

function TaskForm({ addTask }) {
  const [newTask, setNewTask] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      addTask(newTask);
      setNewTask('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TaskInput
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Add a new task"
        whileFocus={{ scale: 1.05 }}
      />
      <AddTaskButton type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        Add Task
      </AddTaskButton>
    </form>
  );
}

export default TaskForm;