import { Button, ButtonProps, message } from "antd";
import { useState } from "react";

export interface IMyButtonProps extends ButtonProps {
  onLoadingClick?: (evt: any) => Promise<void>
}

export function MyButton({
  children,
  onClick,
  onLoadingClick,
  ...props
}: IMyButtonProps) {
  const [ loading, setLoading ] = useState(false)

  return (
    <Button
      {...props}
      loading={loading}
      onClick={async (evt) => {
        if(!onLoadingClick) {
          onClick?.(evt)
        } else {
          setLoading(true)
          try {
            await onLoadingClick(evt)
          } catch(err) {
            if(err instanceof Error) {
              message.error(err.message)
            }
          } finally {
            setLoading(false)
          }
        }
      }}
    >
      {children}
    </Button>
  )
}