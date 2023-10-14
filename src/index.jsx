import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>"Hello World"</div>
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
    <RouterProvider router={router} />
    <App />
	</React.StrictMode>
)