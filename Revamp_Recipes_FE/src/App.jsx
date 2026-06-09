import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Dashboard from "./pages/recipes/DashboardAllRecipes.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GoogleCallback from "./Services/googleCallback.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import DetailRecipe from "./pages/recipes/DetailRecipe.jsx";
import AddRecipe from "./pages/recipes/AddRecipe.jsx";
import MyRecipes from "./pages/recipes/DashboardMyRecipes.jsx";
import DashboardLayout from "./layouts/DahboardLayout.jsx";
import DashboardAllRecipes from "./pages/recipes/DashboardAllRecipes.jsx";
import DashboardMyRecipes from "./pages/recipes/DashboardMyRecipes.jsx";
import Layouting from "../src/kasus/Layouting.jsx";
import ChildOne from "./kasus/ChildOne.jsx";
import ChildTwo from "./kasus/ChildTwo.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardAllRecipes />
      },
      {
        path: "allRecipes", // 👈 Hapus tanda "/" di depan
        element: <DashboardAllRecipes />
      },
      {
        path: "myRecipes",  // 👈 Hapus tanda "/" di depan
        element: <DashboardMyRecipes />
      }
    ]
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
  },



  {
    path: "/dashboard",
    element: <Layouting />,
    children: [
      {
        index: true,
        element: <ChildOne />
      },
      {
        path: "child-one",
        element: <ChildOne />
      },
      {
        path: "child-two",
        element: <ChildTwo />
      }
    ]
  }
]);

const App = () => {
  return (
    <RouterProvider router={router} />
  )
};

export default App;
