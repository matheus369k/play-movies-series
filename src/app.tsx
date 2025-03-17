import { RouterProvider } from "react-router-dom";
import { router } from "./router/app-router";

export function App() {
  return <RouterProvider router={router} />;
}
