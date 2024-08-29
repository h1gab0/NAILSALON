import React, { useState, useEffect } from 'react';
import { usePresence } from 'framer-motion';
import { FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { TaskItem as StyledTaskItem, TaskCheckbox, TaskText, TaskActions, ActionButton, TaskInput } from './StyledComponents';

function TaskItem({ task, toggleTask, deleteTask, editTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.text);
  const [isPresent, safeToRemove] = usePresence();

  useEffect(() => {
    !isPresent && setTimeout(safeToRemove, 300);
  }, [isPresent, safeToRemove]);

  const handleEdit = () => {
    editTask(task.id, editedText);
    setIsEditing(false);
  };

  return (
    <StyledTaskItem
      layout
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={{
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            y: { type: "spring", stiffness: 500, damping: 25 },
            opacity: { duration: 0.15 }
          }
        },
        hidden: { 
          opacity: 0, 
          y: 20,
          transition: {
            y: { type: "spring", stiffness: 500, damping: 25 },
            opacity: { duration: 0.15 }
          }
        }
      }}
    >
      <TaskCheckbox
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleTask(task.id)}
      />
      {isEditing ? (
        <TaskInput
          type="text"
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          onBlur={handleEdit}
          autoFocus
        />
      ) : (
        <TaskText completed={task.completed}>{task.text}</TaskText>
      )}
      <TaskActions>
        {isEditing ? (
          <>
            <ActionButton onClick={handleEdit}><FaSave /></ActionButton>
            <ActionButton onClick={() => setIsEditing(false)}><FaTimes /></ActionButton>
          </>
        ) : (
          <>
            <ActionButton onClick={() => setIsEditing(true)}><FaEdit /></ActionButton>
            <ActionButton onClick={() => deleteTask(task.id)}><FaTrash /></ActionButton>
          </>
        )}
      </TaskActions>
    </StyledTaskItem>
  );
}

export default TaskItem;