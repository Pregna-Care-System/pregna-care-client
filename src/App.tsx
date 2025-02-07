import { createBrowserRouter, Navigate, Outlet, RouteObject, RouterProvider } from 'react-router-dom'
import MainLayout from '@layouts/MainLayout'
import { Fragment, Suspense } from 'react'
import { privateRoutes, publicRoutes } from './routes'
import ROUTES from './utils/config/routes'
import Loading from '@components/Loading'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from './store/modules/global/selector'

function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const publicRouterObjects: RouteObject[] = publicRoutes.map(({ path, component: Component, layout }) => {
    const Layout = layout === null ? Fragment : layout || MainLayout

    return {
      path: path,
      element: (
        <Suspense fallback={<Loading />}>
          <Layout>
            <Component />
          </Layout>
        </Suspense>
      )
    }
  })

  const privateRouterObjects: RouteObject[] = privateRoutes.map(({ path, component: Component, layout }) => {
    const Layout = layout === null ? Fragment : layout || MainLayout

    return {
      path: path,
      element: isAuthenticated ? (
        <Suspense fallback={<Loading />}>
          <Layout>
            <Component />
          </Layout>
        </Suspense>
      ) : (
        <Navigate to='/login' replace />
      )
    }
  })

  // Gộp public và private routes
  const appRouter = [...publicRouterObjects, ...privateRouterObjects]

  appRouter.push({
    path: ROUTES.NOT_FOUND,
    element: <h2>404 - Page Not Found</h2>
  })

  // Tạo router
  const router = createBrowserRouter([
    {
      element: <Outlet />,
      children: appRouter
    }
  ])

  return <RouterProvider router={router} />
}

export default App
