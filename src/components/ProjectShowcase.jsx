import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
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
justify-content: center;
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

const FileItem = styled(motion.li)`
margin: 0.5rem 0;
cursor: pointer;
display: flex;
align-items: center;
`;

const FileName = styled.span`
margin-left: 0.5rem;
`;

const CodePreview = styled(motion.pre)`
background-color: ${({ theme }) => theme.colors.cardBackground};
padding: 1rem;
border-radius: 8px;
overflow-x: auto;
margin-top: 1rem;
`;

const projects = [
  { id: 'task-manager', component: TaskManager, title: 'Task Manager' },
  { id: 'calculator', component: Calculator, title: 'Calculator' },
  { id: 'weather-app', component: WeatherApp, title: 'Weather App' },
  { id: 'inventory-control', component: InventoryControl, title: 'Inventory Control' },
  { id: 'retail-order-system', component: RetailOrderSystems, title: 'Retail Order System' },
];

const projectCode = {
  'task-manager': `
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence, usePresence } from 'framer-motion';
import { FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const ProjectContainer = styled(motion.div)\`
  background-color: \${({ theme }) => theme.colors.cardBackground};
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
\`;

// ... rest of the TaskManager component code
`,
  'calculator': `
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Calculator = () => {
  const [display, setDisplay] = useState('0');

  // ... rest of the Calculator component code
};

export default Calculator;
`,
  'weather-app': `
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);

  // ... rest of the WeatherApp component code
};

export default WeatherApp;
`,
  'inventory-control': `
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { loadState, saveState } from './sharedStateManager';

const InventoryControl = () => {
  const [state, setState] = useState(() => {
    const loadedState = loadState();
    return {
      ...loadedState,
      newItem: { name: '', quantity: '', price: '' }
    };
  });

  // ... rest of the InventoryControl component code
};

export default InventoryControl;
`,
  'retail-order-system': `
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { loadState, saveState } from './sharedStateManager';

const RetailOrderSystem = () => {
  const [state, setState] = useState(() => {
    const loadedState = loadState();
    return {
      ...loadedState,
      newOrder: { customer: '', product: '', quantity: '' }
    };
  });

  // ... rest of the RetailOrderSystem component code
};

export default RetailOrderSystem;
`,
};

const FileTreeItem = ({ name, content, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const isFolder = typeof content === 'object';

  const toggleOpen = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    } else {
      setShowCode(!showCode);
    }
  };

  return (
    <>
      <FileItem
        onClick={toggleOpen}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {isFolder ? (
          isOpen ? <FaFolderOpen /> : <FaFolder />
        ) : (
          <FaFile />
        )}
        <FileName>{name}</FileName>
      </FileItem>
      <AnimatePresence>
        {isOpen && isFolder && (
          <FileTree>
            {Object.entries(content).map(([key, value]) => (
              <FileTreeItem key={key} name={key} content={value} level={level + 1} />
            ))}
          </FileTree>
        )}
        {showCode && !isFolder && (
          <CodePreview
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {content}
          </CodePreview>
        )}
      </AnimatePresence>
    </>
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
      <h2>Project Code</h2>
      <CodePreview>
        {projectCode[projectId]}
      </CodePreview>
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
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
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