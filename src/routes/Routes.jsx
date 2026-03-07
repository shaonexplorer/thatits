import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/homePage/HomePage";
import MainLayout from "../layouts/MainLayout";
import PrivacyPolicyPage from "../shared/PrivacyPolicyPage";
import TermsOfServicePage from "../shared/TermsOfServicePage";
import Consult from "../components/consult/Consult";
import ExamPage from "../pages/examPage/ExamPage";
import ProductSuggest from "../components/product/ProductSuggest";

// Error component
const ErrorPage = () => (
  <div className="w-full min-h-screen flex flex-col items-center justify-center px-4">
    <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
    <p className="text-xl text-gray-600 mb-8">Page not found</p>
    <a
      href="/"
      className="px-8 py-3 bg-[#AD5E5C] text-white rounded-lg hover:bg-[#9a4e4d] transition"
    >
      Go back to home
    </a>
  </div>
);

const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "consult",
        element: <Consult />,
        errorElement: <ErrorPage />,
      },
      {
        path: "exam",
        element: <ExamPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "products",
        element: <ProductSuggest />,
        errorElement: <ErrorPage />,
      },
      {
        path: "privacy-policy",
        element: <PrivacyPolicyPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "terms-of-service",
        element: <TermsOfServicePage />,
        errorElement: <ErrorPage />,
      },
    ],
  },

  // Catch-all 404 route
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export default routes;
