import { Switch, SwitchProps } from "antd";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'

type ISwitchValue = string | boolean

interface ISwitchProps {
  value?: ISwitchValue
  onChange?: (v: ISwitchValue) => void
  // 选择项: [checked, unChecked]
  options: [ISwitchValue, ISwitchValue]
}

export function MySwitch({
  value,
  onChange,
  options,
  ...props
}: ISwitchProps & SwitchProps) {
  return (
    <Switch
      checked={options?.[0] === value}
      checkedChildren={<CheckOutlined />}
      unCheckedChildren={<CloseOutlined />}
      onChange={(checked) => {
        if(checked) {
          onChange?.(options?.[0])
        } else {
          onChange?.(options?.[1])
        }
      }}
      {...props}
    />
  )
}