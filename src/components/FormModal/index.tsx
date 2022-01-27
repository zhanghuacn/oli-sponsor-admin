import { Button, Form, FormInstance, message, Modal, Radio, RadioChangeEvent, Spin } from "antd"
import { FormLayout } from "antd/lib/form/Form"
import classNames from "classnames"
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react"
import css from './index.module.less'

interface IOkResult {
  msg: string
}

interface IFormModalProps {
  onOk: (data: any) => Promise<IOkResult | void>
  children: any
  title: string
  closable?: boolean
  keyboard?: boolean
  labelCol?: any
  wrapperCol?: any
  initialValues?: any
  width?: number
  form?: FormInstance
  layout?: FormLayout
}

export interface IFormModalRef {
  form: FormInstance
  show: () => void
  hide: () => void
  setLoading: (v: boolean) => void
}

function FormModal({
  onOk,
  children,
  title,
  keyboard,
  closable,
  labelCol,
  wrapperCol,
  initialValues,
  width,
  layout,
}: IFormModalProps
, _ref: any) {
  const [ mounted, setMount ] = useState(false)
  const form = Form.useForm()[0]
  const [ submitting, setSubmitting ] = useState(false)
  const [ visible, setVisible ] = useState(false)
  const [ loading, setLoading ] = useState(false)
  const onModalOk = async () => {
    try {
      setSubmitting(true)
      await form.validateFields()
      // 获取被touch过的数据
      const data = form.getFieldsValue(true, ({ touched }) => touched)
      const result = await onOk(data)
      if(result) {
        if(result.msg) {
          message.success(result.msg)
        }
      } else {
        message.success('Successful operation')
      }

      setVisible(false)
    } catch(err) {
      if(err instanceof Error) {
        message.error(err.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  useImperativeHandle(_ref, () => ({
    form,
    show: () => setVisible(true),
    hide: () => setVisible(false),
    setLoading
  }))

  useEffect(() => {
    setMount(true)
  }, [])

  return <Modal
    title={title}
    destroyOnClose={true}
    visible={visible}
    onCancel={() => setVisible(false)}
    onOk={onModalOk}
    maskClosable={false}
    keyboard={keyboard}
    closable={closable}
    width={width || 520}
    footer={(
      <>
        <Button onClick={() => setVisible(false)}>cancel</Button>
        <Button type="primary" loading={submitting} onClick={onModalOk}>finish</Button>
      </>
    )}
    bodyStyle={{
      maxHeight: mounted ? window.screen.height - 358 : 'auto',
      overflowY: 'auto',
      overflowX: 'hidden'
    }}
    style={{
      paddingBottom: 0
    }}
  >
    <Spin spinning={loading}>
      <Form
        labelCol={labelCol || { span: 6 }}
        wrapperCol={wrapperCol || { span: 18 }}
        form={form}
        preserve={false}
        layout={layout}
        initialValues={initialValues}
        className={classNames(css.form)}
      >
        {children}
      </Form>
    </Spin>
  </Modal>
}

interface IDisabledRadioFormItem {
  value?: number
  onChange?: (e: RadioChangeEvent) => void;
}

export function DisabledRadioFormItem({ value, onChange }: IDisabledRadioFormItem) {
  return (
    <Radio.Group onChange={onChange} value={value}>
      <Radio value={0}>启用</Radio>
      <Radio value={1}>禁用</Radio>
    </Radio.Group>
  )
}

export default forwardRef(FormModal)