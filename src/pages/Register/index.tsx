import { Button, Form, Input, InputNumber, message, Steps } from 'antd'
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { MultiUploadDragger, RichEditor } from '../../components/FormWapper';
import { AwsUploader } from '../../utils/upload';
import css from './index.module.less'
import formCss from '../../components/FormModal/index.module.less'
import { FileImageOutlined } from '@ant-design/icons'
import { useForm } from 'antd/lib/form/Form';
import { AdminService } from '../../services';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string'
import { useStore } from '../../components/Hooks/StoreProvider';

interface IBackdropFormItemProps {
  value?: string
  onChange?: (v: string) => void
}

export function BackdropFormItem({
  value,
  onChange
}: IBackdropFormItemProps) {
  const [ progress, setProgress ] = useState<number>(-1)
  const ipt = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if(progress >= 0 && progress < 100) {
      setTimeout(() => {
        setProgress((p) => {
          if(p === -1) {
            return p
          }

          const percent = p + (100 - p) / 5
          return percent >= 99 ? 99 : percent
        })
      }, 500)
    }
  }, [progress])

  return (
    <div
      className={css.backdropFormItem}
      style={{
        backgroundImage: `url(${value || require('../../assets/images/bg-charity.png')})`
      }}
      onClick={() => {
        if(progress < 0) {
          ipt?.current?.click()
        }
      }}
    >
      <input
        type="file"
        ref={ipt}
        accept="image/*"
        onChange={(evt) => {
          const files = evt.target.files;
          if(files && files.length > 0) {
            setProgress(0)
            const image = files[0]
            AwsUploader.upload(image)
              .then((res) => {
                onChange?.(res)
              })
              .catch((err) => {})
              .finally(() => {
                setProgress(-1)
              })
          }
        }}
      />
      <div className={classNames({
        [css.mask]: true,
        [css.show]: progress >= 0
      })}>
        {progress >= 0 ? `${progress.toFixed(2)}%` : <>
          <i className="iconfont icon-picture" />
          &nbsp;
          Change background picture
        </>}
      </div>
    </div>
  )
}

export function AvatarFormItem({
  value,
  onChange
}: IBackdropFormItemProps) {
  const [ progress, setProgress ] = useState<number>(-1)
  const ipt = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if(progress >= 0 && progress < 100) {
      setTimeout(() => {
        setProgress((p) => {
          if(p === -1) {
            return p
          }

          const percent = p + (100 - p) / 5
          return percent >= 99 ? 99 : percent
        })
      }, 500)
    }
  }, [progress])

  return (
    <div
      className={css.avatarFormItem}
      style={{
        backgroundImage: `url(${value || require('../../assets/images/logo-charity.png')})`
      }}
      onClick={() => {
        if(progress < 0) {
          ipt?.current?.click()
        }
      }}
    >
      <input
        type="file"
        ref={ipt}
        accept="image/*"
        onChange={(evt) => {
          const files = evt.target.files;
          if(files && files.length > 0) {
            setProgress(0)
            const image = files[0]
            AwsUploader.upload(image)
              .then((res) => {
                onChange?.(res)
              })
              .catch((err) => {})
              .finally(() => {
                setProgress(-1)
              })
          }
        }}
      />
      <div className={classNames({
        [css.mask]: true,
        [css.show]: progress >= 0
      })}>
        {progress >= 0
          ? `${progress.toFixed(2)}%`
          : <i className="iconfont icon-picture" />}
      </div>
    </div>
  )
}

function Register() {
  const [ step, setStep ] = useState(0)
  const [ form ] = useForm()
  const [ submitting, setSubmitting ] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const queryMap = queryString.parse(location.search)
  const store = useStore()

  useEffect(() => {
    if(!queryMap.token) {
      navigate('/login')
    }
  }, [])

  return (
    <div className={css.registerWrapper} onScroll={(evt) => {
      const div = evt.target as any
      const radio = [0, .15, .5, 2]
      const v = div.scrollTop / div.offsetHeight
      let index = 0
      for(let i = 0; i < radio.length; i++) {
        if(v <= radio[i]) {
          index = i
          break
        }
      }

      if(index !== step) {
        setStep(index)
      }
    }}>
      <Form
        form={form}
        className={classNames(css.form, formCss.form)}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item
          wrapperCol={{ span: 24 }}
          name="backdrop"
        >
          <BackdropFormItem />
        </Form.Item>

        <Form.Item
          name="logo"
          wrapperCol={{ span: 24 }}
        >
          <AvatarFormItem />
        </Form.Item>

        <div className={css.itemBox}>
          <div className={css.title}>
            Basic information
          </div>

          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Website"
            name="website"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            label="Introduce"
            name="introduce"
            rules={[{ required: true }]}
          >
            <RichEditor />
          </Form.Item>
        </div>

        <div className={css.itemBox}>
          <div className={css.title}>
            Contact information
          </div>

          <Form.Item
            label="Contact"
            name="contact"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mobile"
            name="mobile"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true },
              { type: 'email' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </div>

        <div className={css.itemBox}>
          <div className={css.title}>
            Others
          </div>

          <Form.Item
            label="Staff number"
            name="staff_num"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item
            label="Files"
            name="credentials"
            rules={[{ required: true }]}
          >
            <MultiUploadDragger />
          </Form.Item>

          <Form.Item
            label="Documents"
            name="documents"
            rules={[{ required: true }]}
          >
            <MultiUploadDragger />
          </Form.Item>
        </div>

        <div className={css.footerBtn}>
          <Button
            type="primary"
            loading={submitting}
            onClick={async () => {
              try {
                setSubmitting(true)
                await form.validateFields()
                const data = form .getFieldsValue()
                await store.user.register({
                  ...data,
                  token: queryMap.token
                })
                navigate('/')
              } catch(err) {
                if(err instanceof Error) {
                  message.error(err.message)
                }
              } finally {
                setSubmitting(false)
              }
            }}
          >
            Submit
          </Button>
        </div>
      </Form>

      <div className={css.stepWrapper}>
        <Steps progressDot current={step} direction="vertical">
          <Steps.Step
            title="Background and logo"
            description="This is a description."
          />
          <Steps.Step
            title="Basic information"
            description="This is a description."
          />
          <Steps.Step
            title="Contact information"
            description="This is a description."
          />
          <Steps.Step
            title="Others"
            description="This is a description."
          />
        </Steps>
      </div>
    </div>
  )
}

export default Register