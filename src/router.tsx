import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Home } from './pages/Home';
import { Menu } from './pages/Menu';
import { Contacto } from './pages/Contacto';
import { Alma } from './pages/Alma';
import { NotFound } from './pages/NotFound';
import { Admin } from './pages/Admin';

export const router = createBrowserRouter([
  {
    path: '/admin',
    element: <Admin />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'menu',
        element: <Menu />,
      },
      {
        path: 'alma',
        element: <Alma />,
      },
      {
        path: 'eventos',
        element: <Contacto />,
      },
      {
        path: 'contacto',
        element: <Contacto />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
