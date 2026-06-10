import { Row } from '@amzn/stencil-react-components/layout';
import { CollapsedSideNav } from './components/CollapsedSideNav';
import { CopilotPage } from './pages/CopilotPage';

const App = () => {
  return (
    <Row minHeight="100vh" backgroundColor="color.surface.bg-default">
      <CollapsedSideNav />
      <CopilotPage />
    </Row>
  );
};

export default App;
