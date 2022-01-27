import { Input, message, Tabs } from "antd"
import classNames from "classnames"
import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { IGlobalSearchModel } from "../../models"
import { AdminService } from "../../services"
import css from './index.module.less'
import queryString from 'query-string'
import { observer, useLocalObservable } from "mobx-react-lite"
import { MyBreadcrumb } from "../../components/Layout"

interface ISearchState {
  data: IGlobalSearchModel | undefined
  tabKey: string
  loading: boolean
  get isShowEvents(): boolean
  get isShowProducts(): boolean
  setTabKey: (key: string) => void
  search: (keyword: string) => void
}

function Search() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = useLocalObservable<ISearchState>(() => ({
    data: undefined,
    tabKey: 'all',
    loading: false,
    get isShowEvents() {
      const { data } = state as ISearchState
      return data?.events && data?.events?.length > 0 || false
    },
    get isShowProducts() {
      const { data } = state as ISearchState
      return data?.products && data?.products?.length > 0 || false
    },
    setTabKey(key: string) {
      state.tabKey = key
    },
    async search(keyword: string) {
      try {
        state.loading = true
        const data = await AdminService.searchGlobalValue(keyword)
        state.data = data
      } catch(err) {
        if(err instanceof Error) {
          message.error(err.message)
        }
      } finally {
        state.loading = false
      }
    }
  }))

  useEffect(() => {
    const queryParams = queryString.parse(location.search)
    const keyword = queryParams.keyword as string
    if(keyword) {
      state.search(keyword)
    }
  }, [location.search])

  return (
    <>
      <MyBreadcrumb list={['Search']} />
      <div className={css.header}>
        <div className={css.search}>
          <Input.Search
            enterButton="Search"
            loading={state.loading}
            onSearch={(value) => {
              if(value) {
                state.search(value)
              }
            }}
          />
        </div>

        <Tabs
          className="tabs"
          activeKey={state.tabKey}
          onChange={state.setTabKey}
        >
          <Tabs.TabPane tab="All" key="all" />
          {state.isShowEvents && <Tabs.TabPane tab="Events" key="events" />}
          {/* {isShowStaffs && <Tabs.TabPane tab="Person" key="person" />} */}
          {state.isShowProducts && <Tabs.TabPane tab="Products" key="products" />}
        </Tabs>
      </div>

      <div className={css.main}>
        {state.isShowEvents && (state.tabKey === 'all' || state.tabKey === 'events') && (
          <>
            <div className={css.topTitle}>
              Events
            </div>
            <ul className={css.eventsWrapper}>
              {state.data?.events?.map((v) => (
                <li
                  key={v.id}
                  onClick={() => {
                    navigate(`/events/detail/${v.id}`)
                  }}
                >
                  <img src={v.image} />
                  <div className={css.info}>
                    <div className={css.tit}>
                      {v.name}
                    </div>
                    <div className={css.location}>
                      <span>
                        {v.location}
                      </span>
                      <span>
                        {v.begin_time}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {state.isShowEvents && (state.tabKey === 'all' || state.tabKey === 'products') && (
          <>
            <div className={css.topTitle}>
              Products
            </div>
            <ul className={classNames(css.eventsWrapper, css.productsWrapper)}>
              {state.data?.products?.map((v) => (
                <li
                  key={v.id}
                >
                  <img src={v.image} />
                  <div className={css.info}>
                    <div className={css.tit}>
                      {v.name}
                    </div>
                    <div className={css.location}>
                      {v.description}
                    </div>
                    <div className={css.total}>
                      <div className={css.item}>
                        <div className={css.top}>
                          Total income
                        </div>
                        <div className={css.bottom}>
                          ${v.income}
                        </div>
                      </div>

                      <div className={css.item}>
                        <div className={css.top}>
                          Sold
                        </div>
                        <div className={css.bottom}>
                          {v.sold}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  )
}

export default observer(Search)