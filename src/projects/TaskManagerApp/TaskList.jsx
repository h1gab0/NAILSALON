import React from 'react';
import TaskItem from './TaskItem';
import { TaskListContainer, TaskList as StyledTaskList } from './StyledComponents';
import { AnimatePresence } from 'framer-motion';

function TaskList({ tasks, toggleTask, deleteTask, editTask }) {
  return (
    <AnimatePresence initial={false}>
      {tasks.length > 0 && (
        <TaskListContainer
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={{
            visible: { 
              height: "auto",
              opacity: 1,
              transition: {
                height: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                staggerChildren: 0.07,
                delayChildren: 0.2
              }
            },
            hidden: { 
              height: 0,
              opacity: 0,
              transition: {
                height: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }
            }
          }}
        >
          <StyledTaskList>
            <AnimatePresence initial={false}>
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  toggleTask={toggleTask}
                  deleteTask={deleteTask}
                  editTask={editTask}
                />
              ))}
            </AnimatePresence>
          </StyledTaskList>
        </TaskListContainer>
      )}
    </AnimatePresence>
  );
}

export default TaskList;