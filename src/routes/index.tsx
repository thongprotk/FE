import { createBrowserRouter } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import NotFound from "@/pages/NotFound";
import MainLayout from "@/layouts/MainLayout";
import LandingPage from "@/pages/LandingPage";
import ReviewMode from "@/pages/ReviewMode";
import HeatmapPage from "@/pages/HeatmapPage";
import ChromeExtensionPopup from "@/pages/ChromeExtension";

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
                path: "review",
                element: <ReviewMode />,
            },
            {
                path: "heatmap",
                element: <HeatmapPage />,
            },
            {
                path: "extension",
                element: <ChromeExtensionPopup />,
            },
            {
                path: "lesson",
                element: <div>Bài học</div>,
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
