import css from './index.module.less'
import { Observer } from 'mobx-react-lite'
import { Empty, Pagination, Spin } from "antd"
import classNames from 'classnames'
import { PageStore } from '../../../stores/page'
import { IEventsModel } from '../../../models'
import { useNavigate } from 'react-router-dom'

export interface IEventsListView2Props {
  list: IEventsModel[]
}

export interface IEventsListViewProps {
  page: PageStore<IEventsModel>
}

export function EventsListView2({
  list
}: IEventsListView2Props) {
  const navigate = useNavigate()

  return (
    <ul className={classNames('cardListView', css.eventsList2)}>
      {list?.map?.((v) => (
        <li key={v.id} onClick={() => {
          navigate(`/events/detail/${v.id}`)
        }}>
          <img src={v.image} />
          <div className="info">
            <div className="tit">
              {v.name}
            </div>
            <div className="location">
              {v.location}
              &nbsp;&nbsp;
              {v.begin_time}
            </div>
            <div className={css.desc}>
              {v.description}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

export function EventsListView({
  page
}: IEventsListViewProps) {
  const navigate = useNavigate()

  return (
    <Observer>
      {() => (
        <>
          <div className={css.eventsList}>
            <Spin spinning={page.loading}>
              {
                (page.errMsg || page?.list?.length === 0)
                ? (
                  <Empty
                    className={css.empty}
                    description={page.errMsg || 'no data'}
                  />
                )
                : (
                  <ul className="cardListView">
                    {page.list?.map?.((v) => (
                      <li key={v.id} onClick={() => {
                        navigate(`/events/detail/${v.id}`)
                      }}>
                        <img src={v.image} />
                        <div className="info">
                          <div className="tit">
                            {v.name}
                          </div>
                          <div className="location">
                            <span>{v.location}</span>
                            <span>{v.begin_time}</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )
              }
            </Spin>
          </div>
          <Pagination
            size="small"
            className="pagination"
            showSizeChanger
            showQuickJumper
            total={page.total}
            current={page.page}
            pageSize={page.size}
            onChange={(p, s) => page.changePage(p, s)}
          />
        </>
      )}
    </Observer>
  )
}