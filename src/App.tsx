import { createBrowserRouter, Navigate, Outlet, type RouteObject, RouterProvider } from 'react-router-dom'
import MainLayout from '@layouts/MainLayout'
import { Fragment, Suspense } from 'react'
import { privateRoutes, publicRoutes } from './routes'
import useAuth from './hooks/useAuth'
import ROUTES from './utils/config/routes'
import Loading from '@components/Loading'

function App() {
  const { isAuthenticated } = useAuth()

  const createRouteObject = (route: any, isPrivate: boolean): RouteObject => {
    const Layout = route.layout === null ? Fragment : route.layout || MainLayout
    const Component = route.component

    const element = (
      <Suspense fallback={<Loading />}>
        <Layout>{isPrivate && !isAuthenticated ? <Navigate to={ROUTES.LOGIN} replace /> : <Component />}</Layout>
      </Suspense>
    )

    const routeObject: RouteObject = {
      path: route.path,
      element: element
    }

    if (route.children) {
      routeObject.children = route.children.map((childRoute: any) =>
        createRouteObject({ ...childRoute, layout: route.layout }, isPrivate)
      )
    }

    return routeObject
  }

  const publicRouterObjects: RouteObject[] = publicRoutes.map((route) => createRouteObject(route, false))
  const privateRouterObjects: RouteObject[] = privateRoutes.map((route) => createRouteObject(route, true))

  const appRouter = [...publicRouterObjects, ...privateRouterObjects]

  appRouter.push({
    path: ROUTES.NOT_FOUND,
    element: <h2>404 - Page Not Found</h2>
  })

  const router = createBrowserRouter([
    {
      element: <Outlet />,
      children: appRouter
    }
  ])

  return <RouterProvider router={router} />
}

export default App
