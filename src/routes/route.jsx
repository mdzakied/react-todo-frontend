import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Error404 from "@shared/components/Error/Error404";
import ErrorBoundary from "@/shared/components/Error/ErrorBoundary";

import Login from "@pages/Authentication/Login";
import Register from "../pages/Authentication/Register";

import Layout from "@layouts/Layout";
import Dashboard from "@pages/Dashboard/Dashboard";

import Todo from "@pages/Todo/Todo";

const Router = createBrowserRouter([
  {
    path: "*",
    element: <Error404 />,
  },
  {
    path: "/",
    element: <Navigate to="/dashboard" replace={true} />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "dashboard",
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      </ErrorBoundary>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "todo",
        children: [
          {
            index: true,
            element: <Todo />,
          },
        ],
      },
    ],
  },
]);

export default Router;
