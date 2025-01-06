import { createBrowserRouter, Navigate, Outlet, RouteObject, RouterProvider } from 'react-router-dom'
import MainLayout from './layouts/mainLayout'
import { Fragment, Suspense } from 'react'
import { publicRoutes, privateRoutes } from './routes'
import useAuth from './hooks/useAuth'

function App() {
  const { isAuthenticated } = useAuth()
  
  const publicRouterObjects: RouteObject[] = publicRoutes.map(({ path, component: Component, layout }) => {
    const Layout = layout === null ? Fragment : layout || MainLayout

    return {
      path: path,
      element: (
        <Layout>
          <Component />
        </Layout>
      )
    }
  })

  const privateRouterObjects: RouteObject[] = privateRoutes.map(({ path, component: Component, layout }) => {
    const Layout = layout === null ? Fragment : layout || MainLayout

    return {
      path: path,
      element: isAuthenticated ? (
        <Layout>
          <Component />
        </Layout>
      ) : (
        <Navigate to='/login' replace />
      )
    }
  })

  // Gộp public và private routes
  const appRouter = [...publicRouterObjects, ...privateRouterObjects]

  appRouter.push({
    path: '*',
    element: <h2>404 - Page Not Found</h2>
  })

  // Tạo router
  const router = createBrowserRouter([
    {
      element: <Outlet />,
      children: appRouter
    }
  ])

  return (
    <Suspense>
      <RouterProvider router={router} />
    </Suspense>
  )
}

export default App
