import { createBrowserRouter } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import NotFound from "@/pages/NotFound";
import MainLayout from "@/layouts/MainLayout";
import LandingPage from "@/pages/LandingPage";
import ReviewMode from "@/pages/ReviewMode";
import QuizMode from "@/pages/QuizMode";
import HeatmapPage from "@/pages/HeatmapPage";
import LoginPage from "@/pages/LoginPage";
import DecksPage from "@/pages/DecksPage";
import PrivateRoute from "@/components/PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "landing",
        element: <LandingPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "decks",
        element: (
          <PrivateRoute>
            <DecksPage />
          </PrivateRoute>
        ),
      },
      {
        path: "review",
        element: (
          <PrivateRoute>
            <ReviewMode />
          </PrivateRoute>
        ),
      },
      {
        path: "quiz",
        element: (
          <PrivateRoute>
            <QuizMode />
          </PrivateRoute>
        ),
      },
      {
        path: "heatmap",
        element: (
          <PrivateRoute>
            <HeatmapPage />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
