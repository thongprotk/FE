import { createBrowserRouter } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import NotFound from "@/pages/NotFound";
import MainLayout from "@/layouts/MainLayout";
import LandingPage from "@/pages/LandingPage";
import ReviewMode from "@/pages/ReviewMode";
import HeatmapPage from "@/pages/HeatmapPage";
import LessonBuilderPage from "@/pages/LessonBuilder";
import LoginPage from "@/pages/LoginPage";
import DecksPage from "@/pages/DecksPage";
import PrivateRoute from "@/components/PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // Layout chính
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
        path: "heatmap",
        element: (
          <PrivateRoute>
            <HeatmapPage />
          </PrivateRoute>
        ),
      },
      {
        path: "lesson",
        element: (
          <PrivateRoute>
            <LessonBuilderPage />
          </PrivateRoute>
        ),
      },
    ],
  },

  // 404
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
