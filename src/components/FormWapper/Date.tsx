import { DatePicker } from "antd"
import { SizeType } from "antd/lib/config-provider/SizeContext"
import { PickerProps } from "antd/lib/date-picker/generatePicker"
import moment from "moment"

interface IMyDatePickerProps {
  value?: string
  onChange?: (v: string) => void
  className?: string
  showTime?: boolean
  size?: SizeType
  placeholder?: string
}

export function MyDatePicker({
  value,
  onChange,
  className,
  showTime,
  size,
  placeholder,
}: IMyDatePickerProps) {
  return (
    <DatePicker
      value={value ? moment(value, 'YYYY-MM-DD HH:mm:ss') : null}
      onChange={(v) => {
        onChange?.(v?.format('YYYY-MM-DD HH:mm:ss') as string)
      }}
      showTime={showTime}
      size={size}
      className={className}
      placeholder={placeholder}
    />
  )
}

interface IMyRangePickerProps {
  value?: [string, string]
  onChange?: (n: [string, string]) => void
  className?: string
  showTime?: boolean
  size?: SizeType
}

export function MyRangePicker({
  value,
  onChange,
  className,
  showTime,
  size
}: IMyRangePickerProps) {
  return (
    <DatePicker.RangePicker
      className={className}
      value={value?.map((n) => n ? moment(n, 'YYYY-MM-DD HH:mm:ss') : null) as [moment.Moment, moment.Moment]}
      showTime={showTime}
      size={size}
      onChange={(v) => {
        onChange && onChange(v?.map((n) => n?.format('YYYY-MM-DD HH:mm:ss')) as [string, string])
      }}
    />
  )
}