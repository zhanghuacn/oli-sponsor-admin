import { Button, Col, Form, Input, InputNumber, message, Row, Select, Steps } from "antd"
import { observer, useLocalObservable } from "mobx-react-lite"
import { useParams } from "react-router-dom"
import css from './index.module.less'
import editFormCss from '../../components/FormModal/index.module.less'
import { useForm } from "antd/lib/form/Form"
import classNames from "classnames"
import { MultiUpload, MyDatePicker, MySwitch, RichEditor } from "../../components/FormWapper"
import { MinusCircleOutlined, PlusOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { EventsService } from "../../services"
import { contains, omit } from "underscore"
import { NamePath } from "antd/lib/form/interface"
import { useStore } from "../../components/Hooks/StoreProvider"
import { MyBreadcrumb } from "../../components/Layout"
import { useEffect, useRef } from "react"
import { ILoadingLayoutRef, LoadingLayout } from "../../components/Layout/LoadingLayout"

const editStepList = ['Basic information', 'Event description', 'Lottery', 'Charity sale', 'Staff information']

interface ISalesRenderProps {
  name: NamePath
  className?: string
}

function EventsEdit() {
  const store = useStore()
  const queryParams = useParams()
  const id = parseInt(queryParams.id || '')
  const [ form ] = useForm()
  const layout = useRef<ILoadingLayoutRef>()
  const state = useLocalObservable(() => ({
    step: 0,
    saving: false,
    setStep(step: number) {
      state.step = step
    },
    async init() {
      try {
        if(id) {
          layout.current?.setLoading(true)
          const res = await EventsService.getAuditDetailById(id)
          form.setFieldsValue({
            ...res,
            id,
            status: res?.basic?.status
          })
        } else {
          form.setFieldsValue({
            basic: {
              is_private: false
            }
          })
        }
      } catch(err) {
        if(err instanceof Error) {
          layout.current?.setError(err)
        }
      } finally {
        layout.current?.setLoading(false)
      }
    },
    async submit(type: 'save' | 'submit') {
      try {
        state.saving = true
        await form.validateFields()
        const data = form.getFieldsValue(true)

        if(!data.basic) {
          data.basic = {}
        }

        if(!data.lotteries || data.lotteries.length === 0) {
          delete data.lotteries
        }
        if(!data.sales || data.sales.length === 0) {
          delete data.lotteries
        }

        if(!data.basic.specialty || data.basic.specialty.length === 0) {
          data.basic.specialty = []
        }

        if(!data.basic.timeline || data.basic.timeline.length === 0) {
          data.basic.timeline = []
        }

        if(data.id) {
          data.basic.id = data.id
          const p = omit(data, 'id', 'status')

          if(type === 'submit') {
            await EventsService.submitById(data.id, p)
            message.success('Submitted successfully')
          } else {
            const res = await EventsService.updateById(data.id, p)
            form.setFieldsValue({
              ...res
            })
            message.success('Saved successfully')
          }

        } else {
          const res = await EventsService.save(data)
          form.setFieldsValue({
            ...res
          })
          message.success('Saved successfully')
        }
      } catch(err) {
        if(err instanceof Error) {
          message.error(err.message)
        }
      } finally {
        state.saving = false
      }
    }
  }))
  const renderSales = ({ name, className }: ISalesRenderProps) => (
    <Form.List name={name}>
      {(fields, { add, remove }) => (
        <>
          {fields.map((field) => (
            <div className={css.lotteryItem} key={field.key}>
              <a className={css.close} onClick={() => {
                remove(field.name)
              }}>
                <CloseCircleOutlined />
              </a>
              <Row gutter={10}>
                <Col span={8}>
                  <Form.Item
                    {...field}
                    label="Name"
                    name={[field.name, 'name']}
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={6}>
                  <Form.Item
                    {...field}
                    label="Sponsor"
                    name={[field.name, 'sponsor', 'id']}
                  >
                    <Select>
                      {store.sponsorMap.list?.map((v) => (
                        <Select.Option key={v.id} value={v.id}>{v.name}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={5}>
                  <Form.Item
                    {...field}
                    name={[field.name, "stock"]}
                    label="Stock"
                    rules={[
                      { required: true }
                    ]}
                  >
                    <InputNumber min={0} />
                  </Form.Item>
                </Col>

                <Col span={5}>
                  <Form.Item
                    {...field}
                    name={[field.name, "price"]}
                    label="Price"
                    rules={[
                      { required: true }
                    ]}
                  >
                    <InputNumber min={0} />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    {...field}
                    name={[field.name, "description"]}
                    label="Description"
                    rules={[
                      { required: true }
                    ]}
                  >
                    <Input.TextArea autoSize={{ minRows: 2 }} />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    {...field}
                    name={[field.name, "content"]}
                    label="Content"
                  >
                    <RichEditor />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    {...field}
                    name={[field.name, "images"]}
                    label={(
                      <>
                        Cover pictures
                        <span className={css.privateDesc}>
                          You can upload 1~5pictures to describe your event
                        </span>
                      </>
                    )}
                    rules={[
                      { required: true, message: 'Please enter cover pictures' }
                    ]}
                  >
                    <MultiUpload />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          ))}
          <Form.Item>
            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
              Add goods
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  )

  useEffect(() => {
    state.init()
    store.sponsorMap.refresh()
    store.staffMap.refresh()
  }, [])

  return (
    <>
      <MyBreadcrumb list={['Events', 'Edit Events']} />
      <div className={css.editHeader}>
        <Steps current={state.step}>
          {editStepList.map((v, i) => (
            <Steps.Step key={i} title={`Step ${i + 1}`} description={v} />
          ))}
        </Steps>
      </div>
      <LoadingLayout
        ref={layout}
        className={classNames(css.editWrapper)}
      >
        <Form
          form={form}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          className={classNames(css.form, editFormCss.form)}
        >
          {state.step === 0 && (
            <>
              <div className={css.topTitle}>
                <i>* </i>
                Basic information
              </div>
              <div className={css.formBody}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name={["basic", "name"]}
                      label="Event's name"
                      rules={[
                        { required: true }
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name={["basic", "location"]}
                      label="Address"
                      rules={[
                        { required: true }
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name={["basic", "begin_time"]}
                      label="Event begin time"
                      rules={[
                        { required: true }
                      ]}
                    >
                      <MyDatePicker showTime={true} />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name={["basic", "end_time"]}
                      label="Event end time"
                      rules={[
                        { required: true }
                      ]}
                    >
                      <MyDatePicker showTime={true} />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name={["basic", "price"]}
                      label="Ticket price"
                      rules={[
                        { required: true }
                      ]}
                    >
                      <InputNumber min={0} />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name={["basic", "stock"]}
                      label="Ticket number"
                      rules={[
                        { required: true }
                      ]}
                    >
                      <InputNumber min={0} />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item
                      name={["basic", "description"]}
                      label="Basic description"
                      rules={[
                        { required: true }
                      ]}
                    >
                      <Input.TextArea autoSize={{ minRows: 3 }} />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item
                      name={["basic", "is_private"]}
                      initialValue={false}
                      rules={[
                        { required: true, message: 'please enter Permission requiry' }
                      ]}
                      className={css.privateItem}
                      label={(
                        <>
                          Permission requiry
                          <span className={css.privateDesc}>
                            Once this switch on, everyone need to require permission to join this event first
                          </span>
                        </>
                      )}
                      labelCol={{ span: 20 }}
                      wrapperCol={{ span: 4 }}
                    >
                      <MySwitch options={[true, false]} className={css.privateSwitch} />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item
                      name={["basic", "is_albums"]}
                      initialValue={false}
                      rules={[
                        { required: true, message: 'please enter Permission requiry' }
                      ]}
                      className={css.privateItem}
                      label={(
                        <>
                          Upload album permission
                          <span className={css.privateDesc}>
                            Once this switch on, everyone can upload an event albums
                          </span>
                        </>
                      )}
                      labelCol={{ span: 20 }}
                      wrapperCol={{ span: 4 }}
                    >
                      <MySwitch options={[true, false]} className={css.privateSwitch} />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </>
          )}

          {state.step === 1 && (
            <>
              <div className={css.topTitle}>
                Event description
              </div>

              <div className={css.formBody}>
                <Form.Item
                  name={["basic", "images"]}
                  label={(
                    <>
                      Cover pictures
                      <span className={css.privateDesc}>
                        You can upload 1~5pictures to describe your event
                      </span>
                    </>
                  )}
                  rules={[
                    { required: true, message: 'Please enter cover pictures' }
                  ]}
                >
                  <MultiUpload />
                </Form.Item>

                <Form.Item
                  name={["basic", "content"]}
                  label="Basic content"
                  rules={[
                    { required: true }
                  ]}
                >
                  <RichEditor />
                </Form.Item>

                <Form.Item label="Specialty">
                  <Form.List
                    name={['basic', 'specialty']}
                  >
                    {((fields, { add, remove }) => (
                      <>
                        {fields.map((field) => (
                          <Row gutter={10} key={field.key}>
                            <Col span={6}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'title']}
                                rules={[{ required: true, message: 'Please enter title' }]}
                              >
                                <Input placeholder="title" />
                              </Form.Item>
                            </Col>

                            <Col span={17}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'description']}
                                rules={[{ required: true, message: 'Please enter description' }]}
                              >
                                <Input placeholder="description" />
                              </Form.Item>
                            </Col>

                            <Col span={1}>
                              <MinusCircleOutlined
                                onClick={() => remove(field.name)}
                                className={css.specialtyMinusIcon}
                              />
                            </Col>
                          </Row>
                        ))}

                        <Form.Item>
                          <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                            Add specialty
                          </Button>
                        </Form.Item>
                      </>
                    ))}
                  </Form.List>
                </Form.Item>

                <Form.Item label="Timeline">
                  <Form.List
                    name={['basic', 'timeline']}
                  >
                    {((fields, { add, remove }) => (
                      <>
                        {fields.map((field) => (
                          <Row gutter={10} key={field.key}>
                            <Col span={6}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'time']}
                                rules={[{ required: true, message: 'Please enter time' }]}
                              >
                                <MyDatePicker showTime={true} placeholder="time" />
                              </Form.Item>
                            </Col>

                            <Col span={6}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'title']}
                                rules={[{ required: true, message: 'Please enter title' }]}
                              >
                                <Input placeholder="title" />
                              </Form.Item>
                            </Col>

                            <Col span={11}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'description']}
                                rules={[{ required: true, message: 'Please enter description' }]}
                              >
                                <Input placeholder="description" />
                              </Form.Item>
                            </Col>

                            <Col span={1}>
                              <MinusCircleOutlined
                                onClick={() => remove(field.name)}
                                className={css.specialtyMinusIcon}
                              />
                            </Col>
                          </Row>
                        ))}

                        <Form.Item>
                          <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                            Add timeline
                          </Button>
                        </Form.Item>
                      </>
                    ))}
                  </Form.List>
                </Form.Item>
              </div>
            </>
          )}

          {state.step === 2 && (
            <>
              <div className={css.topTitle}>
                Lottery
              </div>

              <div className={css.formBody}>
                <Form.List name="lotteries">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field) => (
                        <div className={css.lotteryItem} key={field.key}>
                          <a className={css.close} onClick={() => {
                            remove(field.name)
                          }}>
                            <CloseCircleOutlined />
                          </a>
                          <Row gutter={10}>
                            <Col span={8}>
                              <Form.Item
                                {...field}
                                label="Lottery name"
                                name={[field.name, 'name']}
                                rules={[{ required: true }]}
                              >
                                <Input />
                              </Form.Item>
                            </Col>

                            <Col span={8}>
                              <Form.Item
                                {...field}
                                label="Lottery type"
                                name={[field.name, 'type']}
                                rules={[{ required: true }]}
                              >
                                <Select>
                                  <Select.Option value="AUTOMATIC">
                                    automatic
                                  </Select.Option>

                                  <Select.Option value="MANUAL">
                                    manual
                                  </Select.Option>
                                </Select>
                              </Form.Item>
                            </Col>

                            <Col span={8}>
                              <Form.Item
                                {...field}
                                name={[field.name, "standard_amount"]}
                                label="Lottery standard amount"
                                rules={[
                                  { required: true }
                                ]}
                              >
                                <InputNumber min={0} />
                              </Form.Item>
                            </Col>

                            <Col span={8}>
                              <Form.Item
                                {...field}
                                name={[field.name, "begin_time"]}
                                label="Lottery begin time"
                                rules={[
                                  { required: true }
                                ]}
                              >
                                <MyDatePicker showTime={true} />
                              </Form.Item>
                            </Col>

                            <Col span={8}>
                              <Form.Item
                                {...field}
                                name={[field.name, "end_time"]}
                                label="Lottery end time"
                                rules={[
                                  { required: true }
                                ]}
                              >
                                <MyDatePicker showTime={true} />
                              </Form.Item>
                            </Col>

                            <Col span={8}>
                              <Form.Item
                                {...field}
                                name={[field.name, "draw_time"]}
                                label="Lottery draw time"
                                rules={[
                                  { required: true }
                                ]}
                              >
                                <MyDatePicker showTime={true} />
                              </Form.Item>
                            </Col>

                            <Col span={24}>
                              <Form.Item
                                {...field}
                                name={[field.name, "description"]}
                                label="Lottery description"
                                rules={[
                                  { required: true }
                                ]}
                              >
                                <Input.TextArea autoSize={{ minRows: 2 }} />
                              </Form.Item>
                            </Col>

                            <Col span={24}>
                              <Form.Item
                                {...field}
                                name={[field.name, "images"]}
                                label={(
                                  <>
                                    Cover pictures
                                    <span className={css.privateDesc}>
                                      You can upload 1~5pictures to describe your event
                                    </span>
                                  </>
                                )}
                                rules={[
                                  { required: true, message: 'Please enter cover pictures' }
                                ]}
                              >
                                <MultiUpload />
                              </Form.Item>
                            </Col>
                          </Row>

                          <div className="ant-form-item">
                            <div className="ant-col ant-col-24 ant-form-item-label">
                              Prizes
                            </div>
                            {renderSales({
                              name: [field.name, 'prizes']
                            })}
                          </div>

                        </div>
                      ))}
                      <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                          Add lottery
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </div>
            </>
          )}

          {state.step === 3 && (
            <>
              <div className={css.topTitle}>
                Charity sale
              </div>

              <div className={css.formBody}>
                {renderSales({
                  name: 'sales'
                })}
              </div>
            </>
          )}

          {state.step === 4 && (
            <>
              <div className={css.topTitle}>
                Staff information
              </div>

              <div className={css.formBody}>
                <Form.List name="staffs">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field) => (
                        <Row gutter={10} key={field.key}>
                          <Col span={11}>
                            <Form.Item
                              {...field}
                              name={[field.name, 'type']}
                              rules={[{ required: true, message: 'Please enter type' }]}
                            >
                              <Select placeholder="type">
                                <Select.Option value="HOST">Host</Select.Option>
                                <Select.Option value="STAFF">Staff</Select.Option>
                              </Select>
                            </Form.Item>
                          </Col>

                          <Col span={11}>
                            <Form.Item
                              {...field}
                              name={[field.name, 'uid']}
                              rules={[{ required: true, message: 'Please enter user id' }]}
                            >
                              <Select placeholder="name">
                                {store.staffMap?.list?.map((v) => (
                                  <Select.Option key={v.uid} value={v.id}>{v.name}</Select.Option>
                                ))}
                              </Select>
                            </Form.Item>

                          </Col>

                          <Col span={1}>
                            <MinusCircleOutlined
                              onClick={() => remove(field.name)}
                              className={css.specialtyMinusIcon}
                            />
                          </Col>
                        </Row>
                      ))}
                      <Form.Item wrapperCol={{ span: 22 }}>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                          Add specialty
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </div>
            </>
          )}
        </Form>
      </LoadingLayout>
      <div className={classNames('detailFooter')}>
        <Button
          type="primary"
          loading={state.saving}
          className={css.saveBtn}
          onClick={() => {
            state.submit('save')
          }}
        >
          Save
        </Button>

        {state.step > 0 && state.step <= 4 && (
          <Button onClick={() => {
            state.setStep(state.step - 1)
          }}>
            Prev
          </Button>
        )}

        {state.step < 4 && (
          <Button  onClick={async () => {
            try {
              await form.validateFields()
              state.setStep(state.step + 1)
            } catch(err) {
              if(err instanceof Error) {
                message.error(err.message)
              }
            }
          }}>
            Next
          </Button>
        )}

        {state.step === 4 && form.getFieldValue('id') && contains(['WAIT', 'PASSED', 'REFUSE'], form.getFieldValue('status')) && (
          <Button loading={state.saving} onClick={() => {
            state.submit('submit')
          }}>
            Finish
          </Button>
        )}
      </div>
    </>
  )
}

export default observer(EventsEdit)