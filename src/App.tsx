import { RouterProvider } from 'react-router-dom';
import { Agentation } from 'agentation';
import { Toaster } from 'sonner';
import { router } from './router';

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="bottom-right"
        theme="dark"
        toastOptions={{
          style: {
            background: '#121214',
            border: '1px solid rgba(192,38,211,0.25)',
            color: '#fff',
            fontFamily: 'Manrope, system-ui, sans-serif',
          },
        }}
      />
      {import.meta.env.DEV && <Agentation />}
    </>
  );
}

export default App;
