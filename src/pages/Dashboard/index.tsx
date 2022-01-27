import { Input, message } from "antd"
import { useEffect, useState } from "react"
import { IDashboardModel } from "../../models"
import { AdminService } from "../../services"
import css from './index.module.less'
import { range } from 'underscore'
import MineLineChart from "../../components/Charts/DashboardLineChart"
import classNames from "classnames"
import MineRingChart from "../../components/Charts/DashboardRingChart"

function Dashboard() {
  const [ data, setData ] = useState<IDashboardModel>()

  useEffect(() => {
    AdminService.getDashboardData()
      .then((res) => {
        setData(res)
      })
      .catch((err) => {
        if(err instanceof Error) {
          message.error(err.message)
        }
      })
  }, [])

  console.log(data)

  return (
    <div className={classNames('tableLayout', css.layout)}>
      <div className={css.charts}>
        <div className={css.topLeft}>
          <div className={css.boxTitle}>
            Donation Received
          </div>
          <div className={css.chart}>
            <ul>
              {range(9).map((i) => (
                <li key={i}></li>
              ))}
            </ul>
            <MineLineChart data={data?.received || []} />
          </div>
        </div>

        <div className={css.topRight}>
          <div className={css.boxTitle}>Donation Sources</div>
          <MineRingChart data={data?.sources} />
        </div>
      </div>

      <div className={css.bottomWrapper}>
        <div className={css.events}>
          <div className={css.boxTitle}>
            Events
            <span className={css.num}>{data?.events?.length}</span>
          </div>
          <ul className={css.body}>
            {data?.events?.map((v) => (
              <li key={v.id}>
                <img src={v.image} />
                <div className={css.info}>
                  <div className={css.tit}>{v.name}</div>
                  <div className={css.desc}>{v.description}</div>
                  <div className={css.position}>
                    <span>
                      <i className={classNames('iconfont', 'icon-position')} />
                      &nbsp;
                      {v.location}
                    </span>

                    <span>
                      <i className={classNames('iconfont', 'icon-time-circle')} />
                      &nbsp;
                      {v.begin_time}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <a className={css.link} href="/events">
            <i className="iconfont icon-plus-circle" />
          </a>
        </div>

        <div className={css.staff}>
          <div className={css.boxTitle}>
            Staff
          </div>

          <ul>
            {data?.staffs?.map((v, i) => (
              <li key={i}>
                <img src={v.avatar} />
                <div className={css.info}>
                  <div className={css.tit}>{v.nickname}</div>
                  <div className={css.desc}>{v.profile}</div>
                </div>
              </li>
            ))}
          </ul>

          <a className={css.link} href="/admin/manager">
            <i className="iconfont icon-plus-circle" />
          </a>
        </div>

        <div className={classNames(css.staff, css.follow)}>
          <div className={css.boxTitle}>
            Follower
          </div>

          <ul>
            {data?.followers?.map((v, i) => (
              <li key={v.id}>
                <img src={v.avatar} />
                <div className={css.info}>
                  <div className={css.tit}>{v.name}</div>
                  <div className={css.desc}>{v.profile}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Dashboard