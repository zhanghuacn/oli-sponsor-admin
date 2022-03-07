import { Image } from "antd"
import { useEffect, useMemo } from "react"
import { useParams } from "react-router-dom"
import { MyBreadcrumb } from "../../components/Layout"
import PageTable from "../../components/PageTable"
import { IEventsGiftModel, IEventsGiftUserModel } from "../../models"
import { EventsService } from "../../services"
import { PageStore } from "../../stores/page"
import css from './index.module.less'

interface IEventsGiftModel2 extends IEventsGiftModel {
  page?: PageStore<IEventsGiftUserModel>
}

function EventsGiftApplicationUser() {
  const queryParams = useParams()
  const id = parseInt(queryParams.id || '')
  const page = useMemo(() => new PageStore<IEventsGiftModel2>({
    query: (p) => EventsService.getGiftPageById(id, p)
  }), [id])
  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'name', title: 'Name' },
    { key: 'description', title: 'Description', ellipsis: true },
    { key: 'images', title: 'Image', render: (v: string[]) => (
      <Image src={v?.[0]} width={80} height={80} />
    )}
  ]
  const expandedRowRender = (record: IEventsGiftModel2) => {
    const columns = [
      { key: 'id', title: 'ID' },
      { key: 'name', title: 'Name' },
      { key: 'avatar', title: 'Avatar', render: (v: string[]) => (
        <Image src={v?.[0]} width={80} height={80} />
      )},
      { key: 'email', title: 'Email' },
      { key: 'phone', title: 'Phone' },
      { key: 'first_name', title: 'First name' },
      { key: 'middle_name', title: 'Middle name' },
      { key: 'last_name', title: 'Last name' },
    ];

    return (
      record.page && (
        <PageTable
          columns={columns}
          store={record.page}
          className={css.innerTable}
          size="small"
        />
      )
    )
  }

  useEffect(() => {
    page.refresh()
  }, [])

  return (
    <>
      <MyBreadcrumb list={['Events', 'Gifts']} />

      <PageTable
        columns={columns}
        store={page}
        expandable={{
          expandedRowRender,
          onExpand(expanded, record) {
            if(expanded) {
              if(!record.page) {
                record.page = new PageStore({
                  query: (p) => EventsService.getGiftUserPageById(record.id, id, p)
                })
              }

              record.page.refresh()
            }
          }
        }}
      />
    </>
  )
}

export default EventsGiftApplicationUser