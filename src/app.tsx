import { RouterProvider } from "react-router-dom";
import { router } from "./router/appRouter";

export function App() {
  return <RouterProvider router={router} />;
}
