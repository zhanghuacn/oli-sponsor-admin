import { useEffect, useMemo } from "react"
import { EventsService } from "../../services"
import { PageStore } from "../../stores/page"
import css from './index.module.less'
import { EventsListView, MyBreadcrumb } from "../../components/Layout"

function Events() {
  const page = useMemo(() => new PageStore({
    query: EventsService.getPage
  }), [])

  useEffect(() => {
    page.refresh()
  }, [])

  return (
    <>
      <MyBreadcrumb list={['Events']} />
      <div className={css.eventsList}>
        <EventsListView page={page} />
      </div>
    </>
  )
}

export default Events