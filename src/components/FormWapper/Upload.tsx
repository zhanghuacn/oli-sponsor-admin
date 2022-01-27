import { message, Modal, Upload } from "antd";
import { RcFile } from "antd/lib/upload";
import { useEffect, useMemo, useRef, useState } from "react";
import { PlusOutlined, InboxOutlined } from '@ant-design/icons'
import { uuid } from "../../utils";
import { AwsUploader } from "../../utils/upload";

export interface IMyUploadProps {
  value?: string
  onChange?: (v: string | undefined) => void
  className?: string
}

function getBase64(file: RcFile): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export function MyUpload({
  value,
  onChange,
  className
}: IMyUploadProps) {
  const [ preview, setPreview ] = useState<string | undefined>()
  const [ progress, setProgress ] = useState<number>(-1)
  const fileList = useMemo(() => {
    if(value) {
      return [{
        uid: uuid(6, 10),
        name: value,
        url: value
      }]
    } else {
      return []
    }
  }, [value])

  useEffect(() => {
    if(progress >= 0 && progress < 100) {
      setTimeout(() => {
        setProgress((p) => {
          if(p === -1) {
            return p
          }

          const percent = p + (100 - p) / 5
          return percent >= 99 ? 99 : percent
        })
      }, 500)
    }
  }, [progress])

  return (
    <>
      <Upload
        disabled={progress >= 0}
        listType="picture-card"
        fileList={fileList}
        customRequest={async ({ file, onSuccess, onError }) => {
          try {
            setProgress(0)
            const url = await AwsUploader.upload(file as RcFile)
            onSuccess?.(url)
            onChange?.(url)
          } catch(err: any) {
            if(err instanceof Error) {
              message.error(err.message)
            }

            onError?.(err)
          } finally {
            setProgress(-1)
          }
        }}
        onPreview={async (file) => {
          if (!file.url && !file.preview && file.originFileObj) {
            file.preview = await getBase64(file.originFileObj) as string
          }

          setPreview(file.url || file.preview)
        }}
        // onChange={({ fileList }) => {
        //   if(fileList && fileList.length > 0) {
        //     onChange?.(fileList[0].url as string)
        //   } else {
        //     onChange?.(undefined)
        //   }
        // }}
        onRemove={() => {
          onChange?.(undefined)
        }}
      >
        {fileList.length === 0 && (
          progress > 0
          ? <div>{progress.toFixed(2)}%</div>
          : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )
        )}
      </Upload>

      <Modal
        visible={!!preview}
        footer={null}
        onCancel={() => {
          setPreview(undefined)
        }}
      >
        <img style={{ width: '100%' }} src={preview} />
      </Modal>
    </>
  )
}

interface IMultiUploadProps {
  value?: string[]
  onChange?: (v: string[]) => void
  className?: string
  size?: number
}

export function MultiUpload({
  value,
  onChange,
  size = 5,
  className
}: IMultiUploadProps) {
  const [ preview, setPreview ] = useState<string | undefined>()
  const [ progress, setProgress ] = useState<number>(-1)
  const fileList = useMemo(() => {
    if(value && value?.length > 0) {
      return value.map((v, i) => ({
        uid: `${i}_${uuid(4, 10)}`,
        name: v,
        url: v
      }))
    } else {
      return []
    }
  }, [value])

  useEffect(() => {
    if(progress >= 0 && progress < 100) {
      setTimeout(() => {
        setProgress((p) => {
          if(p === -1) {
            return p
          }

          const percent = p + (100 - p) / 5
          return percent >= 99 ? 99 : percent
        })
      }, 500)
    }
  }, [progress])

  return (
    <>
      <Upload
        disabled={progress >= 0}
        listType="picture-card"
        fileList={fileList}
        customRequest={async ({ file, onSuccess, onError }) => {
          try {
            setProgress(0)
            const url = await AwsUploader.upload(file as RcFile)
            onSuccess?.(url)
            const v = [...(value || []), url].slice(0, size)
            console.log(v)
            onChange?.(v)
          } catch(err: any) {
            if(err instanceof Error) {
              message.error(err.message)
            }

            onError?.(err)
          } finally {
            setProgress(-1)
          }
        }}
        onPreview={async (file) => {
          if (!file.url && !file.preview && file.originFileObj) {
            file.preview = await getBase64(file.originFileObj) as string
          }

          setPreview(file.url || file.preview)
        }}
        // onChange={({ fileList }) => {
        //   if(fileList && fileList.length > size) {
        //     onChange?.(fileList[0].url as string)
        //   } else {
        //     onChange?.(undefined)
        //   }
        // }}
        onRemove={(file) => {
          if(value) {
            onChange?.(value.filter((v) => v !== file.url as string))
          }
        }}
      >
        {fileList.length < size && (
          progress > 0
          ? <div>{progress.toFixed(2)}%</div>
          : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )
        )}
      </Upload>

      <Modal
        visible={!!preview}
        footer={null}
        onCancel={() => {
          setPreview(undefined)
        }}
      >
        <img style={{ width: '100%' }} src={preview} />
      </Modal>
    </>
  )
}

interface IMultiUploadDraggerProps {
  value?: Array<string>
  onChange?: (v: Array<string> | undefined) => void
  size?: number
}

export function MultiUploadDragger({
  value,
  onChange,
  size = 5,
}: IMultiUploadDraggerProps) {
  const [ progress, setProgress ] = useState<number>(-1)
  const fileList = useMemo(() => {
    if(value && value?.length > 0) {
      return value?.map((v) => ({
        uid: `${(+new Date())}-${uuid(4, 10)}`,
        url: v,
        name: v
      }))
    } else {
      return []
    }
  }, [value])

  useEffect(() => {
    if(progress >= 0 && progress < 100) {
      setTimeout(() => {
        setProgress((p) => {
          if(p === -1) {
            return p
          }

          const percent = p + (100 - p) / 5
          return percent >= 99 ? 99 : percent
        })
      }, 500)
    }
  }, [progress])

  return (
    <Upload.Dragger
      name="file"
      disabled={progress >= 0}
      multiple={true}
      fileList={fileList}
      onRemove={(file) => {
        if(value) {
          onChange?.(value.filter((v) => v !== file.url))
        }
      }}
      customRequest={async ({ file, onSuccess, onError }) => {
        try {
          const url = await AwsUploader.upload(file as RcFile)
          onSuccess?.(url)
          const v = [...(value || []), url].slice(0, size)
          onChange?.(v)
        } catch(err: any) {
          if(err instanceof Error) {
            message.error(err.message)
          }

          onError?.(err)
        } finally {
          setProgress(-1)
        }
      }}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Click or drag your business plan to this area to upload</p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload.
      </p>
    </Upload.Dragger>
  )
}