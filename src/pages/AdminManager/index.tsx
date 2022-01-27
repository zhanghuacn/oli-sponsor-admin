import { Button, Form, Image, Input, message } from "antd"
import { useEffect, useMemo, useRef } from "react"
import PageTable from "../../components/PageTable"
import { AdminService } from "../../services"
import { PageStore } from "../../stores/page"
import { DeleteOutlined } from '@ant-design/icons'
import FormModal, { IFormModalRef } from "../../components/FormModal"
import { useStore } from "../../components/Hooks/StoreProvider"
import { IStaffModel } from "../../models"
import { MyBreadcrumb } from "../../components/Layout"

function AdminManager() {
  const page = useMemo(() => new PageStore({
    query: AdminService.getStaffPage
  }), [])
  const store = useStore()
  const editModal = useRef<IFormModalRef>()
  // const [ id, setId ] = useState<number | undefined>()
  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'name', title: 'name' },
    { key: 'avatar', title: 'avatar', render: (v: string) => (
      <Image src={v} width={80} height={80} />
    )},
    { key: 'profile', title: 'profile' },
    { key: '-', title: 'actions', render: (_: void, record: IStaffModel) => (
      <>
        {/* <Button
          className="mr-5"
          icon={<EditOutlined />}
          onClick={async () => {
            editModal.current?.show()
            editModal.current?.setLoading(true)
            try {
              const data = await AdminService.getManagerDetailById(record.id)
              editModal.current?.form.setFieldsValue(data)
              setId(data.id)
            } catch(err) {
              if(err instanceof Error) {
                message.error(err.message)
              }

              editModal.current?.hide()
            } finally {
              editModal.current?.setLoading(false)
            }
          }}
        /> */}
        <Button
          type="primary"
          danger
          icon={<DeleteOutlined />}
          onClick={async () => {
            try {
              await AdminService.removeStaffById(record.id)
              store.staffMap.setForceRefresh()
              page.refresh()
            } catch(err: any) {
              message.error(err.message)
            }
          }}
        />
      </>
    )},
  ]

  useEffect(() => {
    page.refresh()
  }, [])

  return (
    <>
      <MyBreadcrumb
        list={['Management', 'Manager']}
        actions={
          <Button
            type="primary"
            className="mr-5"
            onClick={() => {
              editModal.current?.show()
              // setId(undefined)
            }}
          >
            Add staff
          </Button>
        }
      />

      <PageTable columns={columns} store={page} />

      <FormModal
        ref={editModal}
        title="Edit Staff"
        onOk={async (data) => {
          await AdminService.addStaff(data)
          store.staffMap.setForceRefresh()
          page.refresh()
        }}
      >
        <Form.Item
          name="username"
          label="username"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
      </FormModal>
    </>
  )
}

export default AdminManager