/**
 * src/routes/index.jsx
 *
 * Definisi seluruh routing aplikasi — dipindah dari App.jsx.
 *
 * Sebelum refactor, App.jsx berisi 73 baris yang menggabungkan:
 * 1. Semua import halaman
 * 2. Definisi router config
 * 3. Component App itu sendiri
 *
 * Dengan memisahkan router ke file ini, App.jsx menjadi hanya ~10 baris —
 * tugasnya cukup sebagai "entry point" yang memasang RouterProvider.
 *
 * ─── PERBAIKAN DARI VERSI LAMA ───────────────────────────────────────────────
 *
 * 1. Import duplikat dihapus:
 *    - `Dashboard` (alias dari DashboardAllRecipes) — tidak pernah dipakai
 *    - `MyRecipes` (alias dari DashboardMyRecipes) — tidak pernah dipakai
 *
 * 2. Rute /myRecipes duplikat dihapus:
 *    - Sebelumnya ada DUA definisi /myRecipes:
 *      a. Sebagai child dari DashboardLayout (path "myRecipes")  ← BENAR
 *      b. Sebagai top-level route (/myRecipes)                   ← DUPLIKAT
 *    - Top-level /myRecipes dihapus — sudah ter-cover oleh layout children
 *
 * 3. Import path diperbaiki:
 *    - `import Layout from "../src/case/Layout.jsx"` → path `../src/` dari
 *      dalam `src/` tidak masuk akal. Diperbaiki ke `./case/Layout.jsx`
 *
 * 4. OAuthSuccess dipindah dari Services/ ke pages/auth/
 */

import { createBrowserRouter } from "react-router-dom";

import DashboardLayout    from "../layouts/DashboardLayout.jsx";
import DashboardAllRecipes from "../pages/recipes/DashboardAllRecipes.jsx";
import DashboardMyRecipes  from "../pages/recipes/DashboardMyRecipes.jsx";

import Login          from "../pages/auth/Login.jsx";
import Register       from "../pages/auth/Register.jsx";
import ForgotPassword from "../pages/auth/ForgotPassword.jsx";
import ResetPassword  from "../pages/auth/ResetPassword.jsx";
import OAuthSuccess   from "../pages/auth/OAuthSuccess.jsx";

import DetailRecipe from "../pages/recipes/DetailRecipe.jsx";
import AddRecipe    from "../pages/recipes/AddRecipe.jsx";

const router = createBrowserRouter([
    // ─── Dashboard Layout (Navbar + Sidebar + Outlet) ─────────────────────────
    {
        path: "/",
        element: <DashboardLayout />,
        children: [
            { index: true,          element: <DashboardAllRecipes /> },
            { path: "allRecipes",   element: <DashboardAllRecipes /> },
            { path: "myRecipes",    element: <DashboardMyRecipes /> },
        ],
    },

    // ─── Auth Pages ───────────────────────────────────────────────────────────
    { path: "/oauth-success",   element: <OAuthSuccess /> },
    { path: "/login",           element: <Login /> },
    { path: "/register",        element: <Register /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/reset-password",  element: <ResetPassword /> },

    // ─── Recipe Pages ─────────────────────────────────────────────────────────
    { path: "/recipes/:id", element: <DetailRecipe /> },
    { path: "/addRecipe",   element: <AddRecipe /> },
]);

export default router;
