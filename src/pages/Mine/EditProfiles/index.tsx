import { MyBreadcrumb } from "../../../components/Layout"
import formCss from '../../../components/FormModal/index.module.less'
import css from '../../Register/index.module.less'
import { Form, Input, message } from 'antd'
import classNames from 'classnames';
import { useEffect, useRef } from 'react';
import { MyButton, RichEditor } from '../../../components/FormWapper';
import { useForm } from 'antd/lib/form/Form';
import { useSearchParams } from 'react-router-dom';
import { BackdropFormItem, AvatarFormItem } from '../../Register'
import { ILoadingLayoutRef, LoadingLayout, onLoadingLayoutAsyncWrapper } from "../../../components/Layout/LoadingLayout";
import { observer, useLocalObservable } from "mobx-react-lite";
import { AdminService } from "../../../services";
import { contains } from "underscore";

function EditProfiles() {
  const [ form ] = useForm()
  const [ searchParams ] = useSearchParams()
  const layout = useRef<ILoadingLayoutRef>()
  const state = useLocalObservable(() => ({
    submitting: false,
    stripeType: '',
    init: onLoadingLayoutAsyncWrapper(async () => {
      const data = await AdminService.getSponsorDetail()
      form.setFieldsValue(data)
      const t = searchParams.get('stripe_type')
      if(contains(['refresh', 'return'], t)) {
        state.stripeType = t as string
      }
    }, layout),
    async submit() {
      await form.validateFields()
      const data = form.getFieldsValue()
      if(data.cards?.length === 0) {
        delete data.cards
      }
      await AdminService.updateSponsor(data)
      message.success('Submitted successfully')
    },
  }))

  useEffect(() => {
    state.init()
  }, [])

  return (
    <>
      <MyBreadcrumb list={['Mine', 'Edit profiles']} />
      <LoadingLayout
        ref={layout}
        className={classNames(css.registerWrapper, css.editProfilesWrapper)}
      >
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
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Website"
              name="website"
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item
              label="Introduce"
              name="introduce"
            >
              <RichEditor />
            </Form.Item>
          </div>

          <div className={css.footerBtn}>
            <MyButton
              type="primary"
              loading={state.submitting}
              onLoadingClick={state.submit}
            >
              Submit
            </MyButton>
          </div>
        </Form>
      </LoadingLayout>
    </>
  )
}

export default observer(EditProfiles)