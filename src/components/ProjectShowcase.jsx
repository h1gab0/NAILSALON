import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import TaskManager from '../projects/TaskManagerApp/TaskManager';
import Calculator from '../projects/CalculatorApp/Calculator';
import WeatherApp from '../projects/WeatherApp/Weather';
import InventoryControl from '../projects/Retail&InventoryControlApp/InventoryControl';
import RetailOrderSystems from '../projects/Retail&InventoryControlApp/RetailOrderSystems';
import { FaChevronLeft, FaChevronRight, FaCode, FaFolder, FaFolderOpen, FaFile } from 'react-icons/fa';

const ShowcaseContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 60px);
  padding: 2rem;
`;

const ProjectView = styled(motion.div)`
  width: 100%;
  max-width: 800px;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const Title = styled(motion.h2)`
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const NavigationArrow = styled(motion.button)`
  position: fixed;
  top: 50%;
  background: none;
  border: none;
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  z-index: 10;
  &.left {
    left: 1rem;
  }
  &.right {
    right: 1rem;
  }
`;

const CodeButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 1rem;
`;

const CodeIcon = styled(FaCode)`
  margin-right: 0.5rem;
`;

const CodeCurtain = styled(motion.div)`
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.background};
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 2rem;
  overflow-y: auto;
  height: calc(100% - 60px);
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  z-index: 101;
`;

const StructureContainer = styled(motion.div)`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
`;

const FileTree = styled.ul`
  list-style-type: none;
  padding-left: 1rem;
`;

const FileItemContainer = styled(motion.div)`
  margin-bottom: 0.5rem;
`;

const FileItem = styled(motion.div)`
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.25rem 0;
`;

const CodePreviewWrapper = styled(motion.div)`
  overflow: hidden;
  width: 100%;
`;

const CodePreview = styled.pre`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  width: 100%;
  margin-top: 0.5rem;
`;

const FileName = styled.span`
  margin-left: 0.5rem;
`;

const projects = [
  { id: 'task-manager', component: TaskManager, title: 'Task Manager' },
  { id: 'calculator', component: Calculator, title: 'Calculator' },
  { id: 'weather-app', component: WeatherApp, title: 'Weather App' },
  { id: 'inventory-control', component: InventoryControl, title: 'Inventory Control' },
  { id: 'retail-order-system', component: RetailOrderSystems, title: 'Retail Order System' },
];

const projectFiles = {
  'task-manager': {
    'TaskManager.jsx': `// TaskManager component code`,
    'TaskForm.jsx': `// TaskForm component code`,
    'TaskList.jsx': `// TaskList component code`,
    'TaskItem.jsx': `// TaskItem component code`,
    'FilterContainer.jsx': `// FilterContainer component code`,
    'StyledComponents.jsx': `// Styled components for TaskManager`
  },
  'calculator': {
    'Calculator.jsx': `// Calculator component code`,
    'Display.jsx': `// Display component code`,
    'ButtonGrid.jsx': `// ButtonGrid component code`,
    'Button.jsx': `// Button component code`,
    'CalculatorStyles.jsx': `// Styled components for Calculator`
  },
  'weather-app': {
    'Weather.jsx': `// WeatherApp component code`,
    'WeatherForm.jsx': `// WeatherForm component code`,
    'WeatherInfo.jsx': `// WeatherInfo component code`,
    'StyledComponents.jsx': `// Styled components for WeatherApp`
  },
  'inventory-control': {
    'InventoryControl.jsx': `// InventoryControl component code`,
    'InventoryForm.jsx': `// InventoryForm component code`,
    'InventoryTable.jsx': `// InventoryTable component code`,
    'InventoryTableRow.jsx': `// InventoryTableRow component code`,
    'InventoryStyles.jsx': `// Styled components for InventoryControl`
  },
  'retail-order-system': {
    'RetailOrderSystems.jsx': `// RetailOrderSystem component code`,
    'OrderForm.jsx': `// OrderForm component code`,
    'OrderTable.jsx': `// OrderTable component code`,
    'OrderTableRow.jsx': `// OrderTableRow component code`,
    'RetailOrderStyles.jsx': `// Styled components for RetailOrderSystem`,
    'sharedStateManager.js': `// Shared state management functions`
  }
};

const FileTreeItem = ({ name, content, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const codeRef = useRef(null);
  const [codeHeight, setCodeHeight] = useState(0);

  const isFolder = typeof content === 'object';

  useEffect(() => {
    if (codeRef.current) {
      setCodeHeight(codeRef.current.scrollHeight);
    }
  }, [showCode, content]);

  const toggleOpen = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    } else {
      setShowCode(!showCode);
    }
  };

  return (
    <FileItemContainer layout transition={{ type: "spring", stiffness: 300, damping: 30 }}>
      <FileItem onClick={toggleOpen}>
        {isFolder ? (
          isOpen ? <FaFolderOpen /> : <FaFolder />
        ) : (
          <FaFile />
        )}
        <FileName>{name}</FileName>
      </FileItem>
      <AnimatePresence>
        {isOpen && isFolder && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <FileTree>
              {Object.entries(content).map(([key, value]) => (
                <FileTreeItem key={key} name={key} content={value} level={level + 1} />
              ))}
            </FileTree>
          </motion.div>
        )}
        {showCode && !isFolder && (
          <CodePreviewWrapper
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: codeHeight,
              opacity: 1,
              transition: { 
                height: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }
            }}
            exit={{ 
              height: 0,
              opacity: 0,
              transition: { 
                height: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }
            }}
          >
            <CodePreview ref={codeRef}>
              {content}
            </CodePreview>
          </CodePreviewWrapper>
        )}
      </AnimatePresence>
    </FileItemContainer>
  );
};

const CodeStructure = ({ projectId }) => {
  return (
    <StructureContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Project Structure</h2>
      <LayoutGroup>
        <FileTree>
          <FileTreeItem name={projectId} content={projectFiles[projectId]} />
        </FileTree>
      </LayoutGroup>
    </StructureContainer>
  );
};

function ProjectShowcase() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const currentProjectIndex = projects.findIndex(p => p.id === projectId);
  const currentProject = projects[currentProjectIndex];
  const [showCode, setShowCode] = useState(false);

  const navigateProject = (direction) => {
    const newIndex = (currentProjectIndex + direction + projects.length) % projects.length;
    navigate(`/project-showcase/${projects[newIndex].id}`, { state: { direction } });
  };

  const toggleCode = () => {
    setShowCode(!showCode);
  };

  if (!currentProject) {
    return <div>Project not found</div>;
  }

  const ProjectComponent = currentProject.component;

  return (
    <ShowcaseContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ProjectView>
        <Title>{currentProject.title}</Title>
        <ProjectComponent />
        <CodeButton onClick={toggleCode} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <CodeIcon /> View Code
        </CodeButton>
      </ProjectView>
      <NavigationArrow
        className="left"
        onClick={() => navigateProject(-1)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaChevronLeft />
      </NavigationArrow>
      <NavigationArrow
        className="right"
        onClick={() => navigateProject(1)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaChevronRight />
      </NavigationArrow>
      <AnimatePresence>
        {showCode && (
          <CodeCurtain
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ 
              type: 'spring', 
              damping: 30, 
              stiffness: 300,
              opacity: { duration: 0.2 }
            }}
          >
            <CloseButton onClick={toggleCode} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              ✕
            </CloseButton>
            <CodeStructure projectId={projectId} />
          </CodeCurtain>
        )}
      </AnimatePresence>
    </ShowcaseContainer>
  );
}

export default ProjectShowcase;