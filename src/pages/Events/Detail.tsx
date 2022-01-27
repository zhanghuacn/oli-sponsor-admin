import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import css from './index.module.less'
import { Button, Carousel, Collapse, Steps } from 'antd'
import classNames from 'classnames'
import { AuditOutlined, DeleteOutlined } from '@ant-design/icons'
import { ILoadingLayoutRef, LoadingLayout } from '../../components/Layout/LoadingLayout'
import { IEventsDetailModel } from '../../models'
import { EventsService } from '../../services'
import { MyBreadcrumb } from '../../components/Layout'
import { MyButton } from '../../components/FormWapper'

function EventsDetail() {
  const navigate = useNavigate()
  const queryParams = useParams()
  const layout = useRef<ILoadingLayoutRef>()
  const [ data, setData ] = useState<IEventsDetailModel>()
  const id = parseInt(queryParams.id || '')
  const refresh = async () => {
    layout.current?.setLoading(true)
    EventsService.getDetailById(id)
      .then((res) => {
        setData(res)
      })
      .catch((err) => {
        if(err instanceof Error) {
          layout.current?.setError(err)
        }
      })
      .finally(() => {
        layout.current?.setLoading(false)
      })
  }

  const isShowSpecialty = data?.basic?.specialty && data?.basic?.specialty.length > 0
  const isShowTimeline = data?.basic?.timeline && data?.basic?.timeline.length > 0
  const isShowLotteries = data?.lotteries && data?.lotteries.length > 0
  const isShowSales = data?.sales && data?.sales.length > 0
  const isShowStaff = data?.staffs && data.staffs.length > 0

  useEffect(() => {
    if(id) {
      refresh()
    } else {
      navigate('../')
    }
  }, [])

  return (
    <>
      <MyBreadcrumb list={['Events', data?.basic?.name || '']} />
      <LoadingLayout
        ref={layout}
        className={classNames(css.eventDetail, 'tableLayout')}
      >
        <div>
          {data?.basic?.status === 'WAIT' && <div className={classNames(css.tag, css.unsubmitted)}>
            Unsubmitted
          </div>}

          {data?.basic?.status === 'REVIEW' && <div className={classNames(css.tag, css.auditing)}>
            Auditing
          </div>}

          {data?.basic?.status === 'REFUSE' && <div className={classNames(css.tag, css.declined)}>
            Declined
          </div>}

          {data?.basic?.status === 'PASSED' && data?.basic?.state === 'POST' && <div className={classNames(css.tag, css.posting)}>
            Posting
          </div>}

          {data?.basic?.status === 'PASSED' && data?.basic?.state === 'WAIT' && <div className={classNames(css.tag, css.waiting)}>
            Waiting for starting
          </div>}

          {data?.basic?.status === 'PASSED' && data?.basic?.state === 'CHECK' && <div className={classNames(css.tag, css.checking)}>
            Checking in
          </div>}

          {data?.basic?.status === 'PASSED' && data?.basic?.state === 'PROGRESS' && <div className={classNames(css.tag, css.progress)}>
            In progress
          </div>}

          <div className={css.wrapper}>
            <div className={css.basicInfo}>
              <div className={css.infoWrapper}>
                <h3>{data?.basic?.name}</h3>
                <div className={css.description}>
                  {data?.basic?.description}
                </div>
                <ul className={css.infoList}>
                  <li>
                    <span className={css.tit}>
                      ADD:
                    </span>
                    <span className={css.cont}>
                      {data?.basic?.location}
                    </span>
                  </li>

                  <li>
                    <span className={css.tit}>
                      TIME:
                    </span>
                    <span className={css.cont}>
                      {data?.basic?.begin_time}
                    </span>
                  </li>

                  <li>
                    <span className={css.tit}>
                      PERMISSION:
                    </span>
                    <span className={css.cont}>
                      {data?.basic?.is_private ? 'Required' : 'None'}
                    </span>
                  </li>

                  <li>
                    <span className={css.tit}>
                      TICKET NUMBER:
                    </span>
                    <span className={css.cont}>
                      {data?.basic?.stock}
                    </span>
                  </li>

                  <li>
                    <span className={css.tit}>
                      TICKET PRICE:
                    </span>
                    <span className={css.cont}>
                      ${data?.basic?.price}
                    </span>
                  </li>
                </ul>
              </div>
              <Carousel className={css.swiper} autoplay={true}>
                {data?.basic?.images?.map((v, i) => (
                  <img key={i} src={v} />
                ))}
              </Carousel>
            </div>

            <Collapse
              ghost
              className={css.collapseWrapper}
            >
              {isShowSpecialty && (
                <Collapse.Panel
                  header="Specialties"
                  key="specialties"
                  className={css.specialties}
                >
                  <ul>
                    {data?.basic?.specialty?.map((v, i) => (
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

              {isShowTimeline && (
                <Collapse.Panel
                  header="Timeline"
                  key="timeline"
                  className={css.timeline}
                >
                  <ul>
                    {data?.basic?.timeline?.map((v, i) => (
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

              {isShowLotteries && (
                <Collapse.Panel
                  header="Lottery"
                  key="lottery"
                  className={css.lottery}
                >
                  <ul>
                    {data?.lotteries?.map((v, i) => (
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

              {isShowSales && (
                <Collapse.Panel
                  header="Charity sale"
                  key="sale"
                  className={css.sale}
                >
                  <ul>
                    {data?.sales?.map((v, i) => (
                      <li key={i}>
                        <img src={v.images?.[0]} />
                        <div className={css.info}>
                          <div className={css.name}>
                            {v.name}
                          </div>
                          <div className={css.nums}>
                            <span>Number: {v.stock}</span>
                            <span>Price: ${v.price}</span>
                            <span>Sponsor: {v.sponsor?.name}</span>
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

              {isShowStaff && (
                <Collapse.Panel
                  header="Staff"
                  key="staff"
                  className={css.staff}
                >
                  <ul>
                    {data?.staffs?.map((v, i) => (
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
              {isShowSpecialty && <Steps.Step title="Specialties" />}
              {isShowTimeline && <Steps.Step title="Timeline" />}
              {isShowLotteries && <Steps.Step title="Lottery" />}
              {isShowSales && <Steps.Step title="Charity sale" />}
              {isShowStaff && <Steps.Step title="Staff" />}
            </Steps>
          </div>
        </div>
      </LoadingLayout>

      <div className={classNames('detailFooter')}>
        <Button
          type="primary"
          icon={<AuditOutlined />}
          onClick={() => {
            navigate(`/events/edit/${id}`)
          }}
        >
          Edit
        </Button>

        <MyButton
          danger
          icon={<DeleteOutlined />}
          onLoadingClick={async () => {
            await EventsService.removeById(id)
            navigate('/events')
          }}
        >
          Delete
        </MyButton>
      </div>
    </>
  )
}

export default EventsDetail