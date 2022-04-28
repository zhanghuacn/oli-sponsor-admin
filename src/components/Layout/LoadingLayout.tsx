import { Empty, Spin } from "antd"
import classNames from "classnames"
import { forwardRef, useImperativeHandle, useState } from "react"
import css from './index.module.less'

export interface ILoadingLayoutProps {
  children: React.ReactNode
  className?: string
}

export interface ILoadingLayoutRef {
  setLoading: (v: boolean) => void
  setError: (err: Error) => void
  onAsyncHandle: any
}

const _LoadingLayout = function ({
  children,
  className
}: ILoadingLayoutProps, _ref: any) {
  const [ loading, setLoading ] = useState(false)
  const [ err, setError ] = useState<Error>()

  useImperativeHandle(_ref, () => ({
    setLoading,
    setError,
    onAsyncHandle<T>(fn: (...rest: any[]) => Promise<T[]>) {
      return async (...rest: any[]) => {
        try {
          setLoading(true)
          const data = await fn(...rest)
          if(data?.length === 0) {
            setError(new Error('no data'))
          }
        } catch(err) {
          if(err instanceof Error) {
            setError(err)
          }
        } finally {
          setLoading(false)
        }
      }
    }
  }) as ILoadingLayoutRef)

  return (
    <Spin spinning={loading} wrapperClassName={classNames(className, css.loadingLayout)}>
      {
        err
        ? <Empty description={err.message} />
        : children
      }
    </Spin>
  )
}

export const LoadingLayout = forwardRef(_LoadingLayout)