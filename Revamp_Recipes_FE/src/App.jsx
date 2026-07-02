/**
 * src/App.jsx
 *
 * Entry point aplikasi React.
 * Tanggung jawab satu-satunya: memasang RouterProvider.
 *
 * Router config (semua route definitions) → src/routes/index.jsx
 */

import { RouterProvider } from "react-router-dom";
import router from "./routes/index.jsx";

const App = () => <RouterProvider router={router} />;

export default App;
