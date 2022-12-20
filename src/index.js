import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root, {loader as rootLoader, action as rootAction} from "./routes/root"
import ErrorPage from './ErrorPage';
import Contact from './routes/contacts';
import {loader as contactLoader} from "./routes/contacts"
import EditContact from "./routes/Edit";
import {action as editAction} from "./routes/Edit"
import { deleteAction } from './routes/contacts';
import Index from './routes/childIndex';
import {action as favAction} from "./routes/contacts"
const router = createBrowserRouter([
  {
    path:"/",
    element: <Root/>,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <Index/>
          },
          {
            path:"contacts/:contactId",
            element: <Contact/>,
            loader: contactLoader,
            action: favAction
          },
          {
            path: "contacts/:contactId/edit",
            element: <EditContact />,
            loader: contactLoader,
            action: editAction,
          },
          {
            path: "contacts/:contactId/destroy",
            action: deleteAction,
            errorElement: <div>Oops there was an error</div>
          }
        ]
      }
    ]
  },
  // {
  //   path:"contacts/:contactId",
  //   element: <Contact/>
  // }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

