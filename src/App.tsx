import { createBrowserRouter, Navigate, Outlet, RouteObject, RouterProvider } from 'react-router-dom'
import MainLayout from '@layouts/MainLayout'
import { Fragment, Suspense } from 'react'
import { adminRoutes, memberRoutes, privateRoutes, publicRoutes } from './routes'
import ROUTES from './utils/config/routes'
import Loading from '@components/Loading'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated, selectMemberInfo, selectUserInfo } from './store/modules/global/selector'
import ScrollToTop from '@components/ScrollToTop'

function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const user = useSelector(selectUserInfo)
  const member = useSelector(selectMemberInfo)

  const publicRouterObjects: RouteObject[] = publicRoutes.map(({ path, component: Component, layout }) => {
    const Layout = layout === null ? Fragment : layout || MainLayout

    // Add special handling for login and register routes
    if (path === ROUTES.LOGIN || path === ROUTES.REGISTER) {
      return {
        path: path,
        element: isAuthenticated ? (
          // If user is already logged in, redirect based on role
          user.role === 'Admin' ? (
            <Navigate to={ROUTES.ADMIN.DASHBOARD} replace />
          ) : member?.role === 'Member' ? (
            <Navigate to={ROUTES.MEMBER.DASHBOARD} replace />
          ) : (
            <Navigate to={ROUTES.HOME} replace />
          )
        ) : (
          // If not authenticated, show the login/register page
          <Suspense fallback={<Loading />}>
            <Layout>
              <Component />
            </Layout>
          </Suspense>
        )
      }
    }

    // For other public routes, handle normally
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
        <Navigate to={ROUTES.LOGIN} replace />
      )
    }
  })

  const adminRouterObjects: RouteObject[] = adminRoutes.map(({ path, component: Component, layout }) => {
    const Layout = layout === null ? Fragment : layout || MainLayout

    return {
      path: path,
      element:
        isAuthenticated && user.role === 'Admin' ? (
          <Suspense fallback={<Loading />}>
            <Layout>
              <Component />
            </Layout>
          </Suspense>
        ) : (
          <Navigate to={ROUTES.LOGIN} replace />
        )
    }
  })

  const memberRouterObjects: RouteObject[] = memberRoutes.map(({ path, component: Component, layout }) => {
    const Layout = layout === null ? Fragment : layout || MainLayout

    return {
      path: path,
      element:
        isAuthenticated && member?.role === 'Member' ? (
          <Suspense fallback={<Loading />}>
            <Layout>
              <Component />
            </Layout>
          </Suspense>
        ) : !isAuthenticated ? (
          <Navigate to={ROUTES.LOGIN} replace />
        ) : user.role === 'Admin' ? (
          <Navigate to={ROUTES.ADMIN.DASHBOARD} replace />
        ) : (
          <Navigate to={ROUTES.HOME} replace />
        )
    }
  })

  // Gộp public và private routes
  const appRouter = [...publicRouterObjects, ...privateRouterObjects, ...adminRouterObjects, ...memberRouterObjects]

  appRouter.push({
    path: ROUTES.NOT_FOUND,
    element: <h2>404 - Page Not Found</h2>
  })

  // Tạo router
  const router = createBrowserRouter([
    {
      element: (
        <>
          <ScrollToTop />
          <Outlet />
        </>
      ),
      children: appRouter
    }
  ])

  return <RouterProvider router={router} />
}

export default App
