import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Home from "./pages/recipes/MainDashboard.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GoogleCallback from "./Services/googleCallback.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import DetailRecipe from "./pages/recipes/DetailRecipe.jsx";
import AddRecipe from "./pages/recipes/AddRecipe.jsx";
import MyRecipes from "./pages/myRecipes/MyRecipes.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/oauth-success",
    element: <GoogleCallback />,
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
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/recipes/:id",
    element: <DetailRecipe />
  },
  {
    path: "/addRecipe",
    element: <AddRecipe />
  },
  {
    path: "/myRecipes",
    element: <MyRecipes />
  }
]);

const App = () => {
  return (
    <RouterProvider router={router} />
  )
};

export default App;
