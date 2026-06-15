import { useState, useCallback } from 'react';
import { Col, Row } from '@amzn/stencil-react-components/layout';
import { TopNav } from './components/TopNav';
import { CollapsedSideNav } from './components/CollapsedSideNav';
import { ChatPanel } from './components/ChatPanel';
import { CopilotPage } from './pages/CopilotPage';
import { AgentsPage } from './pages/AgentsPage';
import { ApplicationsPage, applicationSuggestions } from './pages/ApplicationsPage';
import { GenericPage } from './pages/GenericPage';
import { LaborOrdersPage, laborOrderSuggestionsList } from './pages/LaborOrdersPage';
import { WorkflowsPage } from './pages/WorkflowsPage';
import { AppointmentsPage, appointmentUrgentItems } from './pages/AppointmentsPage';
import { SchedulesPage } from './pages/SchedulesPage';
import { JobsPage } from './pages/JobsPage';
import { InsightsPage } from './pages/InsightsPage';

export type NavPage = 'copilot' | 'insights' | 'people' | 'labor-orders' | 'applications' | 'jobs' | 'schedules' | 'appointments' | 'agents' | 'workflows';

const App = () => {
  const [activePage, setActivePage] = useState<NavPage>('copilot');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialMessage, setChatInitialMessage] = useState<string | undefined>();
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  const openChatWithMessage = (msg: string) => {
    setChatInitialMessage(msg);
    setIsChatOpen(true);
  };

  const getPageSuggestions = useCallback((): string[] => {
    switch (activePage) {
      case 'applications':
        return applicationSuggestions.map(s => s.title);
      case 'labor-orders':
        return laborOrderSuggestionsList.map(s => s.title);
      case 'appointments':
        return appointmentUrgentItems.map(s => s.title);
      default:
        return [];
    }
  }, [activePage]);

  const handleTaskComplete = (taskTitle: string) => {
    const newCompleted = new Set(completedTasks).add(taskTitle);
    setCompletedTasks(newCompleted);

    // Find next available task from current page
    const pageSuggestions = getPageSuggestions();
    const nextTask = pageSuggestions.find(t => !newCompleted.has(t));

    if (nextTask) {
      setChatInitialMessage(nextTask);
    } else {
      setChatInitialMessage(undefined);
      setIsChatOpen(false);
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case 'copilot':
        return <CopilotPage />;
      case 'insights':
        return <InsightsPage />;
      case 'people':
        return <GenericPage title="People" />;
      case 'labor-orders':
        return <LaborOrdersPage onReview={openChatWithMessage} completedTasks={completedTasks} />;
      case 'applications':
        return <ApplicationsPage onReview={openChatWithMessage} completedTasks={completedTasks} />;
      case 'jobs':
        return <JobsPage />;
      case 'schedules':
        return <JobsPage />;
      case 'appointments':
        return <AppointmentsPage onReview={openChatWithMessage} completedTasks={completedTasks} />;
      case 'agents':
        return <AgentsPage />;
      case 'workflows':
        return <WorkflowsPage />;
      default:
        return <CopilotPage />;
    }
  };

  return (
    <Col style={{ height: '100vh' }} backgroundColor="color.surface.bg-default">
      <TopNav onChatToggle={() => setIsChatOpen(!isChatOpen)} />
      <Row flex={1} style={{ overflow: 'hidden', minHeight: 0 }}>
        <CollapsedSideNav activePage={activePage} onNavigate={setActivePage} />
        <div style={{ marginLeft: 88, flex: 1, minWidth: 0, display: 'flex', overflow: 'hidden' }}>
          <div style={{ flex: 1, minWidth: 0, overflow: 'auto' }}>
            {renderPage()}
          </div>
          <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} initialMessage={chatInitialMessage} onTaskComplete={handleTaskComplete} />
        </div>
      </Row>
    </Col>
  );
};

export default App;
