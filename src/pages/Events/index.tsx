import { Button, Empty, Form, Image, Input, message, Modal, Pagination, Spin, Table, Tabs } from "antd"
import { Observer } from "mobx-react-lite"
import { useEffect, useMemo, useRef, useState } from "react"
import DashboardRingChart from "../../components/Charts/DashboardRingChart"
import PageTable from "../../components/PageTable"
import { IEventsApplyUserModel, IEventsModel, IEventsUserTicketsModel } from "../../models"
import { EventsService } from "../../services"
import { PageStore } from "../../stores/page"
import css from './index.module.less'
import { AuditOutlined, DownOutlined, UpOutlined } from '@ant-design/icons'
import FormModal, { IFormModalRef } from "../../components/FormModal"
import { MySwitch } from "../../components/FormWapper"
import classNames from "classnames"
import { useStore } from "../../components/Hooks/StoreProvider"
import { useNavigate } from "react-router-dom"
import { EventsListView, MyBreadcrumb } from "../../components/Layout"

interface IEventsModel2 extends IEventsModel {
  list?: IEventsUserTicketsModel[]
}

function Events() {
  const page = useMemo(() => new PageStore({
    query: EventsService.getPage,
    condition: {
      filter: 'ACTIVE'
    }
  }), [])
  const store = useStore()
  const auditModal = useRef<IFormModalRef>()
  const [ tabKey, setTabKey ] = useState('ACTIVE')
  const [ applyUserTabKey, setApplyUserTabKey ] = useState('WAIT')

  const [ applyUserDetail, setApplyUserDetail ] = useState<IEventsModel>()
  const navigate = useNavigate()
  const applyUserPage = useMemo(() => {
    if(applyUserDetail) {
      return new PageStore({
        query: (p) => EventsService.getApplyUserPageById(applyUserDetail.id, p),
        condition: {
          status: 'WAIT'
        }
      })
    }
  }, [applyUserDetail])
  const [ searchValue, setSearchValue ] = useState('')
  const [ userTicketsDetail, setUserTicketsDetail ] = useState<IEventsModel2>()
  const applyUserColumns = [
    { key: 'name', title: 'name' },
    { key: 'avatar', title: 'avatar', render: (v: string) => (
      <Image src={v} width={80} height={80} />
    )},
    { key: 'profile', title: 'profile' },
    { key: '-', title: 'actions', render: (_: void, record: IEventsApplyUserModel) => (
      record.status === 'WAIT' && (
        <Button
          type="primary"
          icon={<AuditOutlined />}
          onClick={() => {
            auditModal.current?.show()
            auditModal.current?.form.setFieldsValue({
              id: record.id
            })
            applyUserPage?.refresh()
          }}
        >
          Audit
        </Button>
      )
    )},
  ]
  const userTicketsColumns = [
    { dataIndex: 'id', title: 'ID' },
    { dataIndex: 'name', title: 'name' },
    { dataIndex: ['group', 'name'], title: 'group name' },
    { dataIndex: 'avatar', title: 'avatar', render: (v: string) => (
      <Image src={v} width={80} height={80} />
    )},
    { dataIndex: 'ticket', title: 'tickets code' },
  ]

  useEffect(() => {
    page.refresh()
  }, [])

  useEffect(() => {
    applyUserPage?.refresh()
  }, [applyUserPage])

  useEffect(() => {
    if(userTicketsDetail && !userTicketsDetail.list) {
      EventsService.getUserTicketsById(userTicketsDetail.id)
        .then((list) => {
          setUserTicketsDetail({
            ...userTicketsDetail,
            list
          })
        })
    }
  }, [userTicketsDetail])

  return (
    <>
      <MyBreadcrumb list={['Events']} />
      <div className={css.tabsWrapper}>
        <Tabs
          size="large"
          activeKey={tabKey}
          className="tabs"
          onChange={(key) => {
            setTabKey(key)
            setSearchValue('')
            page.setCondition({
              filter: key
            })
          }}
        >
          <Tabs.TabPane tab="Active events" key="ACTIVE" />
          <Tabs.TabPane tab="Past events" key="PAST" />
        </Tabs>

        <div className={css.actions}>
          <Input.Search
            size="large"
            placeholder="search"
            className={css.search}
            value={searchValue}
            onChange={(evt) => {
              setSearchValue(evt.target.value)
            }}
            onSearch={(val) => {
              setSearchValue(val)
              page.setCondition({
                ...page.condition,
                keyword: val
              })
            }}
          />

          <Button
            size="large"
            type="primary"
            onClick={() => {
              navigate(`/events/edit`)
            }}
          >
            Create new event
          </Button>
        </div>
      </div>
      <Observer>
        {() => (
          <div className={css.tabContent}>
            {
              page.errMsg || page.list?.length === 0
              ? (
                <Empty className={css.empty} description={page.errMsg || 'no data'} />
              )
              : tabKey === 'PAST'
                ? (
                  <EventsListView page={page} />
                )
                : (
                  <>
                    <Spin spinning={page.loading}>
                      <ul className={css.events}>
                        {page.list?.map((v, i) => (
                          <li key={v.id} onClick={async () => {
                            navigate(`/events/detail/${v.id}`)
                          }}>

                            {v.status === 'WAIT' && <div className={classNames(css.tag, css.unsubmitted)}>
                              Unsubmitted
                            </div>}

                            {v.status === 'REVIEW' && <div className={classNames(css.tag, css.auditing)}>
                              Auditing
                            </div>}

                            {v.status === 'REFUSE' && <div className={classNames(css.tag, css.declined)}>
                              Declined
                            </div>}

                            {v.status === 'PASSED' && v.state === 'POST' && <div className={classNames(css.tag, css.posting)}>
                              Posting
                            </div>}

                            {v.status === 'PASSED' && v.state === 'WAIT' && <div className={classNames(css.tag, css.waiting)}>
                              Waiting for starting
                            </div>}

                            {v.status === 'PASSED' && v.state === 'CHECK' && <div className={classNames(css.tag, css.checking)}>
                              Checking in
                            </div>}

                            {v.status === 'PASSED' && v.state === 'PROGRESS' && <div className={classNames(css.tag, css.progress)}>
                              In progress
                            </div>}

                            <div className={css.title}>
                              {v.name}
                            </div>
                            <div className={css.info}>
                              <span>
                                <i className="iconfont icon-position" />
                                {v.location}
                              </span>

                              <span>
                                <i className="iconfont icon-time-circle" />
                                {v.begin_time}
                              </span>

                              <span onClick={(evt) => {
                                evt?.stopPropagation?.()
                                setApplyUserDetail(v)
                              }}>
                                <i className="iconfont icon-apply" />
                                {v.applies_count}
                              </span>

                              <span onClick={(evt) => {
                                evt?.stopPropagation?.()
                                setUserTicketsDetail(v)
                              }}>
                                <i className="iconfont icon-participation" />
                                {v.tickets_count}
                              </span>

                              <a className={css.expand} onClick={async (evt) => {
                                evt?.stopPropagation?.()
                                if(!v.statistics) {
                                  try {
                                    const detail = await EventsService.getPageDetailById(v.id);
                                    const list = [
                                      ...page.list
                                    ]
                                    list[i] = {
                                      ...list[i],
                                      ...detail
                                    }
                                    page.setList(list)
                                  } catch(err) {
                                    if(err instanceof Error) {
                                      message.error(err.message)
                                    }
                                  }
                                } else {
                                  const list = [
                                    ...page.list
                                  ]
                                  list[i] = {
                                    ...list[i],
                                    statistics: undefined
                                  }
                                  page.setList(list)
                                }
                              }}>
                                {v.statistics
                                  ? <UpOutlined />
                                  : <DownOutlined />}
                              </a>
                            </div>

                            {v?.statistics && (
                              <div className={css.charts}>
                                <div className={css.list}>
                                  <ul className={css.lottery}>
                                    {v.lotteries?.map((v) => (
                                      <li key={v.id}>
                                        <img src={v.image} />
                                        <div className={css.box}>
                                          <div className={css.tit}>{v.name}</div>
                                          <div className={css.time}>
                                            <i className="iconfont icon-time-circle" />
                                            {v.draw_time}
                                          </div>
                                        </div>
                                        {
                                          v.type === 'AUTOMATIC'
                                          ? <span className={css.type}>auto start</span>
                                          : <span className={css.typeAuto}>start</span>
                                        }
                                      </li>
                                    ))}
                                  </ul>

                                  <ul className={css.lottery}>
                                    {v.sales?.map((v) => (
                                      <li key={v.id}>
                                        <img src={v.image} />
                                        <div className={css.box}>
                                          <div className={css.tit}>{v.name}</div>
                                          <div className={css.productInfo}>
                                            <span>sponsor: {v.stock}</span>
                                            <span>sale number: {v.sale_num}</span>
                                            <span>income: {v.income}</span>
                                          </div>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div className={css.chart}>
                                  <DashboardRingChart data={v?.statistics?.constitute} />
                                  <div className={css.total}>
                                    total income: ${v?.statistics?.income}
                                  </div>
                                </div>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </Spin>

                    <Pagination
                      showSizeChanger={true}
                      total={page.total}
                      current={page.page}
                      pageSize={page.size}
                      onChange={(p, s) => page.changePage(p, s)}
                      className={css.pagination}
                    />
                  </>
                )
            }
          </div>
        )}
      </Observer>

      <Modal
        title={`List of applicants for ${applyUserDetail?.name} events`}
        visible={!!applyUserDetail}
        onCancel={() => setApplyUserDetail(undefined)}
        width={1000}
        footer={null}
      >
        <Tabs activeKey={applyUserTabKey} onChange={(key) => {
          setApplyUserTabKey(key)
          applyUserPage?.setCondition({
            status: key
          })
        }}>
          <Tabs.TabPane key="WAIT" tab="wait" />
          <Tabs.TabPane key="PASSED" tab="passed" />
          <Tabs.TabPane key="REFUSE" tab="refuse" />
        </Tabs>
        {applyUserPage && (
          <PageTable
            size="small"
            store={applyUserPage}
            columns={applyUserColumns}
          />
        )}
      </Modal>

      <Modal
        title={`List of tickets for ${userTicketsDetail?.name} events`}
        visible={!!userTicketsDetail}
        onCancel={() => setUserTicketsDetail(undefined)}
        width={1000}
        footer={null}
      >
        <Table
          loading={!userTicketsDetail?.list}
          dataSource={userTicketsDetail?.list}
          columns={userTicketsColumns}
          pagination={false}
        />
      </Modal>

      <FormModal
        ref={auditModal}
        title="Audit events"
        initialValues={{
          status: 'PASSED'
        }}
        onOk={async (data) => {
          if(applyUserDetail) {
            await EventsService.auditApplyUserById(
              auditModal.current?.form.getFieldValue('id'),
              applyUserDetail?.id,
              {
                ...data,
                status: data.status || 'PASSED'
              })
            applyUserPage?.refresh()
          }
        }}
      >
        <Form.Item
          name="remark"
          label="remark"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="status"
          label="status"
          rules={[{ required: true }]}
        >
          <MySwitch options={['PASSED', 'REFUSE']} />
        </Form.Item>
      </FormModal>
    </>
  )
}

export default Events