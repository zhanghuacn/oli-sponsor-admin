import { Layout, Menu, Breadcrumb, Dropdown, Avatar } from 'antd';
import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../Hooks/StoreProvider';
import css from './index.module.less'
import { HomeOutlined, UserOutlined, FileTextOutlined, AppstoreOutlined, SmileOutlined, ToolOutlined, SearchOutlined } from '@ant-design/icons'
import { loginStatusObserver } from '../../utils';
import classNames from 'classnames';
import { contains } from 'underscore';

interface ISiderNavOption {
  title: string
  path: string
  icon: React.ReactElement
  children?: ISiderNavOption[]
}

const _siderNavList: ISiderNavOption[] = [
  {
    title: 'Dashboard',
    path: '/',
    icon: <HomeOutlined />,
  }, {
    title: 'Events',
    path: '/events',
    icon: <i className={classNames('iconfont', 'icon-event', css.siderIcon)} />,
  }, {
    title: 'Manager',
    path: '/admin',
    icon: <UserOutlined />,
  }
];

interface IAdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({
  children
}: IAdminLayoutProps) {
  const store = useStore()
  const navigate = useNavigate()
  const location = useLocation()
  const siderNavList = useMemo(() => {
    if(store.user?.info && !contains(store.user.info.roles || [], 'SUPER-ADMIN')) {
      return _siderNavList.filter((v) => v.path !== '/admin')
    } else {
      return _siderNavList
    }
  }, [])
  // const serializeBreadcrumbMap = (
  //   list: ISiderNavOption[],
  //   titles?: string[]
  // ) => {
  //   const result: any = {}
  //   titles = titles || []

  //   for(const item of list) {
  //     if(item.children) {
  //       Object.assign(result, serializeBreadcrumbMap(item.children, [...titles, item.title]))
  //     } else {
  //       result[item.path] = [...titles, item.title]
  //     }
  //   }

  //   return result
  // }
  // const breadcrumbMap = serializeBreadcrumbMap(siderNavList)
  const renderSiderNav = (list: ISiderNavOption[]) => list.map((item) => {
    if(item.children) {
      return (
        <Menu.SubMenu key={item.path} title={item.title} icon={item.icon}>
          {renderSiderNav(item.children)}
        </Menu.SubMenu>
      )

    } else {
      return (
        <Menu.Item key={item.path} icon={item.icon}>
          {item.title}
        </Menu.Item>
      )
    }
  })
  const handleLogout = () => {
    store.user.logout()
    navigate('/login')
  }

  useEffect(() => {
    loginStatusObserver.on(handleLogout)
    if(!store.user.isLogin) {
      handleLogout()
    }

    return () => {
      loginStatusObserver.remove(handleLogout)
    }
  }, [])

  return (
    <Layout className={css.layout}>
      <Layout.Header className={css.header}>
        <a className={css.search} onClick={() => {
          navigate(`/search`)
        }}>
          <SearchOutlined />
        </a>

        {store.user.isLogin && (
          <Dropdown
            placement="bottomCenter"
            arrow
            overlay={(
              <Menu>
                {/* <Menu.Item
                  onClick={() => {
                    // updatePasswordModal.current?.show()
                  }}
                >
                  修改密码
                </Menu.Item> */}
                <Menu.Item
                  onClick={() => {
                    store.user.logout()
                    navigate('/login')
                  }}
                >
                  Sign out
                </Menu.Item>
              </Menu>
            )} >
            <div className={css.avatar}>
              <Avatar
                gap={4}
                size={24}
                icon={store.user.info?.avatar
                  ? <img src={store.user.info?.avatar} />
                  : <UserOutlined />}
              />
              {store.user.info?.name}
            </div>
          </Dropdown>
        )}
      </Layout.Header>
      <Layout className={css.layout}>
        <Layout.Sider
          width={200}
          theme="light"
        >
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={[location.pathname]}
            onSelect={({ key }) => {
              navigate(key)
            }}
          >
            {renderSiderNav(siderNavList)}
          </Menu>
        </Layout.Sider>
        <Layout.Content>
          {children}
        </Layout.Content>
      </Layout>
    </Layout>
  )
}

interface IMyBreadcrumbProps {
  list: string[]
  actions?: React.ReactNode
}

export function MyBreadcrumb({
  list,
  actions
}: IMyBreadcrumbProps) {
  return (
    <div className={css.breadcrumb}>
      <Breadcrumb>
        {list.map((v, i) => (
          <Breadcrumb.Item key={i}>{v}</Breadcrumb.Item>
        ))}
      </Breadcrumb>

      {actions && (
        <div className={css.actions}>
          {actions}
        </div>
      )}
    </div>
  )
}