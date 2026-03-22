import { RouterProvider } from 'react-router-dom';
import { Agentation } from 'agentation';
import { router } from './router';

function App() {
  return (
    <>
      <RouterProvider router={router} />
      {import.meta.env.DEV && <Agentation />}
    </>
  );
}

export default App;
