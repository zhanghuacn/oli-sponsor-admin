import { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import css from './index.module.less'
import { Button, Carousel, Col, Collapse, Form, Input, InputNumber, message, Modal, Row, Steps } from 'antd'
import classNames from 'classnames'
import { AuditOutlined } from '@ant-design/icons'
import { ILoadingLayoutRef, LoadingLayout } from '../../components/Layout/LoadingLayout'
import { IEventsDetailModel, IEventsLotteryPrizeModel } from '../../models'
import { EventsService } from '../../services'
import { MyBreadcrumb } from '../../components/Layout'
import editFormCss from '../../components/FormModal/index.module.less'
import { useForm } from 'antd/lib/form/Form'
import { MultiUpload, RichEditor } from '../../components/FormWapper'
import { NamePath } from 'antd/lib/form/interface'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { isArray } from 'underscore'

interface ISalesRenderProps {
  name: NamePath
  className?: string
}

interface IEventsDetailState {
  step: number
  visible: boolean
  submitting: boolean
  setStep: (step: number) => void
  setVisible: (visible: boolean) => void
  onEdit: () => void
  submit: () => Promise<void>
  refresh: () => void
  data: IEventsDetailModel | undefined
  get isShowSpecialty(): boolean | undefined
  get isShowTimeline(): boolean | undefined
  get isShowLotteries(): boolean | undefined
  get isShowSales(): boolean | undefined
  get isShowStaff(): boolean | undefined
}

function EventsDetail() {
  const navigate = useNavigate()
  const queryParams = useParams()
  const layout = useRef<ILoadingLayoutRef>()
  const id = parseInt(queryParams.id || '')
  const [ form ] = useForm()
  const state = useLocalObservable<IEventsDetailState>(() => ({
    step: 0,
    data: undefined,
    visible: false,
    submitting: false,
    get isShowSpecialty() {
      const { data } = state as IEventsDetailState
      return data?.basic?.specialty && data?.basic?.specialty.length > 0
    },
    get isShowTimeline() {
      const { data } = state as IEventsDetailState
      return data?.basic?.timeline && data?.basic?.timeline.length > 0
    },
    get isShowLotteries() {
      const { data } = state as IEventsDetailState
      return data?.lotteries && data?.lotteries.length > 0
    },
    get isShowSales() {
      const { data } = state as IEventsDetailState
      return data?.sales && data?.sales.length > 0
    },
    get isShowStaff() {
      const { data } = state as IEventsDetailState
      return data?.staffs && data.staffs.length > 0
    },
    setStep(step: number) {
      state.step = step
    },
    setVisible(visible: boolean) {
      state.visible = visible
    },
    onEdit() {
      state.visible = true
      state.step = 0
      form.resetFields()
      const { data } = state
      const initialValues: any = {}
      if(data?.sales && data.sales?.length > 0) {
        initialValues.sales = data.sales
      }
      const prizes = data?.lotteries?.reduce<IEventsLotteryPrizeModel[]>((res, v) => {
        if(v.prizes?.length > 0) {
          res.push(...v.prizes)
        }
        return res
      }, [])
      if(prizes && prizes?.length > 0) {
        initialValues.prizes = prizes
      }
      form.setFieldsValue(initialValues)
    },
    refresh() {
      layout.current?.setLoading(true)
      EventsService.getDetailById(id)
        .then((res) => {
          state.data = res
        })
        .catch((err) => {
          if(err instanceof Error) {
            layout.current?.setError(err)
          }
        })
        .finally(() => {
          layout.current?.setLoading(false)
        })
    },
    async submit() {
      try {
        state.submitting = true
        await form.validateFields()
        const data = form.getFieldsValue(true)
        for(const k in data) {
          const arr = data[k]
          if(isArray(arr)) {
            for(const item of arr) {
              if(!item.content) {
                delete item.content
              }
            }
          }
        }
        await EventsService.updateById(id, data)
        state.visible = false
        form.resetFields()
        state.step = 0
        state.refresh()
      } catch(err) {
        if(err instanceof Error) {
          message.error(err.message)
        }
      } finally {
        state.submitting = false
      }
    }
  }))
  const renderSales = ({ name, className }: ISalesRenderProps) => (
    <Form.List name={name}>
      {(fields, { add, remove }) => (
        <>
          {fields.map((field) => (
            <div className={css.lotteryItem} key={field.key}>
              {/* <a className={css.close} onClick={() => {
                remove(field.name)
              }}>
                <CloseCircleOutlined />
              </a> */}
              <Row gutter={10}>
                <Col span={12}>
                  <Form.Item
                    {...field}
                    label="Name"
                    name={[field.name, 'name']}
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>

                {/* <Col span={6}>
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
                </Col> */}

                <Col span={6}>
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

                <Col span={6}>
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
                    label="Details"
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
                          You can upload 1~5 pictures
                        </span>
                      </>
                    )}
                    extra="The width*height ratio of the picture must be 375x350"
                    rules={[
                      { required: true, message: 'Please enter cover pictures' }
                    ]}
                  >
                    <MultiUpload widthRatio={375} heightRatio={350} />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          ))}
        </>
      )}
    </Form.List>
  )

  useEffect(() => {
    if(id) {
      state.refresh()
    } else {
      navigate('../')
    }
  }, [])

  return (
    <>
      <MyBreadcrumb list={['Events', state.data?.basic?.name || '']} />
      <LoadingLayout
        ref={layout}
        className={classNames(css.eventDetail, 'tableLayout')}
      >
        <div>
          {state.data?.basic?.status === 'WAIT' && <div className={classNames(css.tag, css.unsubmitted)}>
            Unsubmitted
          </div>}

          {state.data?.basic?.status === 'REVIEW' && <div className={classNames(css.tag, css.auditing)}>
            Auditing
          </div>}

          {state.data?.basic?.status === 'REFUSE' && <div className={classNames(css.tag, css.declined)}>
            Declined
          </div>}

          {state.data?.basic?.status === 'PASSED' && state.data?.basic?.state === 'POST' && <div className={classNames(css.tag, css.posting)}>
            Posting
          </div>}

          {state.data?.basic?.status === 'PASSED' && state.data?.basic?.state === 'WAIT' && <div className={classNames(css.tag, css.waiting)}>
            Waiting for starting
          </div>}

          {state.data?.basic?.status === 'PASSED' && state.data?.basic?.state === 'CHECK' && <div className={classNames(css.tag, css.checking)}>
            Checking in
          </div>}

          {state.data?.basic?.status === 'PASSED' && state.data?.basic?.state === 'PROGRESS' && <div className={classNames(css.tag, css.progress)}>
            In progress
          </div>}

          <div className={css.wrapper}>
            <div className={css.basicInfo}>
              <div className={css.infoWrapper}>
                <h3>{state.data?.basic?.name}</h3>
                <div className={css.description}>
                  {state.data?.basic?.description}
                </div>
                <ul className={css.infoList}>
                  <li>
                    <span className={css.tit}>
                      ADD:
                    </span>
                    <span className={css.cont}>
                      {state.data?.basic?.location}
                    </span>
                  </li>

                  <li>
                    <span className={css.tit}>
                      TIME:
                    </span>
                    <span className={css.cont}>
                      {state.data?.basic?.begin_time}
                    </span>
                  </li>

                  <li>
                    <span className={css.tit}>
                      PERMISSION:
                    </span>
                    <span className={css.cont}>
                      {state.data?.basic?.is_private ? 'Required' : 'None'}
                    </span>
                  </li>

                  <li>
                    <span className={css.tit}>
                      TICKET NUMBER:
                    </span>
                    <span className={css.cont}>
                      {state.data?.basic?.stock}
                    </span>
                  </li>

                  <li>
                    <span className={css.tit}>
                      TICKET PRICE:
                    </span>
                    <span className={css.cont}>
                      ${state.data?.basic?.price}
                    </span>
                  </li>
                </ul>
              </div>
              <Carousel className={css.swiper} autoplay={true}>
                {state.data?.basic?.images?.map((v, i) => (
                  <img key={i} src={v} />
                ))}
              </Carousel>
            </div>

            <Collapse
              ghost
              className={css.collapseWrapper}
            >
              {state.isShowSpecialty && (
                <Collapse.Panel
                  header="Specialties"
                  key="specialties"
                  className={css.specialties}
                >
                  <ul>
                    {state.data?.basic?.specialty?.map((v, i) => (
                      <li key={i}>
                        <i className="iconfont icon-specialty" />
                        <div className={css.info}>
                          <div className={css.tit}>{v.title}</div>
                          <div className={css.cont}>{v.description}</div>
                        </div>
                      </li>
                    ))}

                  </ul>
                </Collapse.Panel>
              )}

              {state.isShowTimeline && (
                <Collapse.Panel
                  header="Timeline"
                  key="timeline"
                  className={css.timeline}
                >
                  <ul>
                    {state.data?.basic?.timeline?.map((v, i) => (
                      <li key={i}>
                        <div className={css.name}>
                          {v.title}
                          &nbsp;
                          {v.time}
                        </div>
                        <div className={css.desc}>
                          {v.description}
                        </div>
                      </li>
                    ))}

                  </ul>
                </Collapse.Panel>
              )}

              {state.isShowLotteries && (
                <Collapse.Panel
                  header="Raffle"
                  key="lottery"
                  className={css.lottery}
                >
                  <ul>
                    {state.data?.lotteries?.map((v, i) => (
                      <li key={i}>
                        <img src={v.images?.[0]} />
                        <div className={css.info}>
                          <div className={css.name}>
                            {v.name}
                          </div>
                          <div className={css.limit}>
                            Limit: donate over ${v.standard_amount}
                          </div>
                          <div className={css.open}>
                            Open: {v.draw_time}
                          </div>
                          <div className={css.desc}>
                            {v.description}
                          </div>
                        </div>
                      </li>
                    ))}

                  </ul>
                </Collapse.Panel>
              )}

              {state.isShowSales && (
                <Collapse.Panel
                  header="Charity sale"
                  key="sale"
                  className={css.sale}
                >
                  <ul>
                    {state.data?.sales?.map((v, i) => (
                      <li key={i}>
                        <img src={v.images?.[0]} />
                        <div className={css.info}>
                          <div className={css.name}>
                            {v.name}
                          </div>
                          <div className={css.nums}>
                            <span>Number: {v.stock}</span>
                            <span>Price: ${v.price}</span>
                            {/* <span>Sponsor: {v.sponsor?.name}</span> */}
                          </div>
                          <div className={css.desc}>
                            {v.description}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Collapse.Panel>
              )}

              {state.isShowStaff && (
                <Collapse.Panel
                  header="Staff"
                  key="staff"
                  className={css.staff}
                >
                  <ul>
                    {state.data?.staffs?.map((v, i) => (
                      <li key={i}>
                        <img src={v.avatar} />
                        <div className={css.info}>
                          <div className={css.name}>
                            {v.name}
                          </div>
                          <div className={css.desc}>
                            {v.profile}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Collapse.Panel>
              )}
            </Collapse>
          </div>

          <div className={css.stepWrapper}>
            <Steps progressDot current={6} direction="vertical">
              <Steps.Step
                title="Basic information"
              />
              {state.isShowSpecialty && <Steps.Step title="Specialties" />}
              {state.isShowTimeline && <Steps.Step title="Timeline" />}
              {state.isShowLotteries && <Steps.Step title="Raffle" />}
              {state.isShowSales && <Steps.Step title="Charity sale" />}
              {state.isShowStaff && <Steps.Step title="Staff" />}
            </Steps>
          </div>
        </div>
      </LoadingLayout>

      <div className={classNames('detailFooter')}>
        <Button
          type="primary"
          icon={<AuditOutlined />}
          onClick={state.onEdit}
        >
          Edit
        </Button>
      </div>

      <Modal
        width={1200}
        className={css.editWrapper}
        visible={state.visible}
        onCancel={() => {
          state.setVisible(false)
        }}
        footer={
          <div>
            {state.step === 1 && (
              <Button onClick={() => {
                state.setStep(state.step - 1)
              }}>
                Prev
              </Button>
            )}

            {state.step === 0 && (
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

            {state.step === 1 && (
              <Button loading={state.submitting} onClick={state.submit}>
                Finish
              </Button>
            )}
          </div>
        }
      >
        <Form
          form={form}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          className={classNames(css.form, editFormCss.form)}
        >
          <div className={css.editHeader}>
            <Steps current={state.step}>
              <Steps.Step title={`Step 1`} description="Raffle prizes" />
              <Steps.Step title={`Step 2`} description="Sales" />
            </Steps>
          </div>
          {state.step === 0 && (
            <>
              <div className={css.topTitle}>
                Raffle prizes
              </div>

              <div className={css.formBody}>
                {renderSales({
                  name: 'prizes'
                })}
              </div>
            </>
          )}
          {state.step === 1 && (
            <>
              <div className={css.topTitle}>
                Sales
              </div>

              <div className={css.formBody}>
                {renderSales({
                  name: 'sales'
                })}
              </div>
            </>
          )}
        </Form>
      </Modal>
    </>
  )
}

export default observer(EventsDetail)