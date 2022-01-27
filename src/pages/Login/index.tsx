import { Button, Form, Input, message } from 'antd'
import { useState } from 'react'
import css from './index.module.less'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useStore } from '../../components/Hooks/StoreProvider'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [ loading, setLoading ] = useState(false)
  const store = useStore()
  const navigate = useNavigate();

  return (
    <div className={css.main}>
      <div className={css.infoWrapper}>
        <div className={css.logo}>
          <img src="" />
          Logo here
        </div>
        <div className={css.desc}>
          descriptions descriptions descriptions descriptions
        </div>
      </div>

      <div className={css.body}>
        <Form className={css.formLogin} onFinish={async (data) => {
          setLoading(true)
          try {
            await store.user.login(data)
            navigate('/')
          } catch(err) {
            if(err instanceof Error) {
              message.error(err.message)
            }
          } finally {
            setLoading(false)
          }
        }}>
          <Form.Item
            name="username"
            rules={[
              { required: true }
            ]}
          >
            <Input size="large" placeholder="Username or email" prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true }
            ]}
          >
            <Input.Password size="large" placeholder="Password" prefix={<LockOutlined />} />
          </Form.Item>

          <Button
            size="large"
            type="primary"
            htmlType="submit"
            className={css.submit}
            loading={loading}
          >
            Sign in
          </Button>
        </Form>
      </div>
    </div>
  )
}

export default Login