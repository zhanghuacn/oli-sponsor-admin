import { Button, Col, message, Row, Table, TableProps } from "antd"
import moment from "moment"
import { Children, useState } from "react"
import { PageStore } from "../../stores/page"
import { CheckOutlined, CloseOutlined, UpOutlined, DownOutlined } from '@ant-design/icons'
import { Form } from "antd"
import css from './index.module.less'
import { Observer } from 'mobx-react-lite'
import { SizeType } from "antd/lib/config-provider/SizeContext"
import { omit } from "underscore"
import classNames from "classnames"

interface IPageTableSearchFormProps<T> {
  onSearch: (s: T) => Promise<void>
  children: any
  initialValues?: any
}

export function PageTableSearchForm<T extends Object>({ onSearch, children, initialValues }: IPageTableSearchFormProps<T>) {
  const [ expand, setExpand ] = useState(false)
  const [ form ] = Form.useForm()
  const items = Children.toArray(children)
  const showExpandCount = 3
  const itemLen = items.length
  const isShowExpand = itemLen > showExpandCount
  let showExpandItemLen = itemLen

  if(isShowExpand && !expand) {
    showExpandItemLen = showExpandCount
  }

  return (
    <Form
      form={form}
      name="advanced_search"
      className={css.searchForm}
      initialValues={initialValues}
      onFinish={async (data: T) => {
        try {
          await onSearch(data)
        } catch(err: any) {
          message.error(err.message)
        }
      }}
    >
      <Row gutter={24}>
        {items.slice(0, showExpandItemLen).map((child, i) => (
          <Col span={8} key={i}>
            {child}
          </Col>
        ))}
      </Row>
      <Row>
        <Col span={24} className={css.searchBtns}>
          <Button type="primary" htmlType="submit">
            搜索
          </Button>
          <Button
            className={css.clean}
            onClick={() => {
              form.resetFields();
              onSearch(initialValues || {})
            }}
          >
            清空
          </Button>
          {isShowExpand && (
            <a
              className={css.expand}
              onClick={() => {
                setExpand(!expand);
              }}
            >
              {expand ? <><UpOutlined />收回</> : <><DownOutlined />展开</>}
            </a>
          )}
        </Col>
      </Row>
    </Form>
  )
}

export interface IPageTableColumn<T> {
  title: string
  key: string | string[]
  render?: (v: any, record: T, index: number) => any
}

interface IPageTableProps<T> {
  store: PageStore<T>
  size?: SizeType
  columns: Array<IPageTableColumn<T>>
}

type ITableProps<T> = Omit<TableProps<T>, 'columns'>

export default function PageTable<T extends Object>({
  store,
  columns,
  className,
  ...rest
}: IPageTableProps<T> & ITableProps<T>) {
  return (
    <Observer>
      {() => (
        <Table
          {...omit(rest, 'columns')}
          className={classNames(className, css.pageTable)}
          rowKey="id"
          loading={store.loading}
          dataSource={store.list}
          pagination={{
            showSizeChanger: true,
            total: store.total,
            current: store.page,
            pageSize: store.size,
            onChange: (p, s) => store.changePage(p, s)
          }}
          columns={columns.map((col) => ({
            ...omit(col, 'key'),
            dataIndex: col.key,
          }))}
        />
      )}
    </Observer>
  )
}

export function renderLongString(s: string, max=8) {
  if(s.length > max) return `${s.slice(0, max)}......`
  return s
}

export function renderTimeStamp(v: number) {
  return v ? moment(v * 1000).format('YYYY-MM-DD HH:mm:ss') : '-'
}

export function renderActiveByBoolean(v: boolean) {
  return v ? <CheckOutlined /> : <CloseOutlined />
}

export function renderDisabledByNumber(v: number) {
  return v !== 1 ? <CheckOutlined /> : <CloseOutlined />
}