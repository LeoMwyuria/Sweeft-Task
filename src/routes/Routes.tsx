import { createBrowserRouter } from 'react-router-dom';
import { Home } from '../pages/Home/Home';
import { History } from '../pages/History/History';
import { Header } from '../components/Header/Header';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Header />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/history',
        element: <History />
      }
    ]
  }
]);