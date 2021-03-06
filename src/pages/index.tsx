import { ConfigProvider, Spin } from "antd"
import en_US from 'antd/lib/locale/en_US'
import { BrowserRouter, useLocation, useRoutes } from "react-router-dom"
import { StoreProvider } from "../components/Hooks/StoreProvider"
import './index.less'
import loadable from "@loadable/component"
import { AdminLayout } from "../components/Layout"
import { contains } from "underscore"

function defaultFallbackLoadable(cb: () => Promise<any>) {
  return loadable(cb, {
    fallback: <Spin />
  })
}

const Dashboard = defaultFallbackLoadable(() => import('../pages/Dashboard'))
const Login = defaultFallbackLoadable(() => import('../pages/Login'))
const AdminManager = defaultFallbackLoadable(() => import('../pages/AdminManager'))
const Events = defaultFallbackLoadable(() => import('../pages/Events'))
const EventsDetail = defaultFallbackLoadable(() => import('./Events/Detail'))
const Register = defaultFallbackLoadable(() => import('../pages/Register'))
const Search = defaultFallbackLoadable(() => import('../pages/Search'))
const MineEditProfiles = defaultFallbackLoadable(() => import('../pages/Mine/EditProfiles'))

function Routes() {
  const location = useLocation()
  const routes = useRoutes([
    { path: '/login', element: <Login /> },
    { path: '/', element: <Dashboard /> },
    { path: '/admin', element: <AdminManager /> },
    { path: '/events', element: <Events /> },
    { path: '/events/detail/:id', element: <EventsDetail /> },
    { path: '/register', element: <Register /> },
    { path: '/search', element: <Search /> },
    { path: '/mine/edit-profiles', element: <MineEditProfiles /> },
  ])

  if(contains(['/login', '/register'], location.pathname)) {
    return routes
  } else {
    return (
      <AdminLayout>
        {routes}
      </AdminLayout>
    )
  }
}

function App() {
  return (
    <ConfigProvider locale={en_US}>
      <StoreProvider>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </StoreProvider>
    </ConfigProvider>
  )
}

export default App
