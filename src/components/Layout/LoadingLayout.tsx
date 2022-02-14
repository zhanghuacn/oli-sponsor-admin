import { Empty, Spin } from "antd"
import { forwardRef, useImperativeHandle, useState } from "react"

export interface ILoadingLayoutProps {
  children: React.ReactNode
  className?: string
}

export interface ILoadingLayoutRef {
  setLoading: (v: boolean) => void
  setError: (err: Error) => void
}

const _LoadingLayout = function ({
  children,
  className
}: ILoadingLayoutProps, _ref: any) {
  const [ loading, setLoading ] = useState(false)
  const [ err, setError ] = useState<Error>()

  useImperativeHandle(_ref, () => ({
    setLoading,
    setError
  }))

  return (
    <Spin spinning={loading} wrapperClassName={className}>
      {
        err
        ? <Empty description={err.message} />
        : children
      }
    </Spin>
  )
}

export function onLoadingLayoutAsyncWrapper(fn: (...rest: any[]) => Promise<void>, layout: React.MutableRefObject<ILoadingLayoutRef | undefined>) {
  return async (...rest: any[]) => {
    try {
      layout.current?.setLoading(true)
      await fn(...rest)
    } catch(err) {
      if(err instanceof Error) {
        layout.current?.setError(err)
      }
    } finally {
      layout.current?.setLoading(false)
    }
  }
}

export const LoadingLayout = forwardRef(_LoadingLayout)