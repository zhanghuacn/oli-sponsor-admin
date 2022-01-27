import classNames from "classnames"
import { useEffect, useMemo, useRef } from "react"
import { IDashboardSourceModel } from "../../models"
import css from './index.module.less'

interface IDashboardRingChartProps {
  data: IDashboardSourceModel[] | undefined
}

function DashboardRingChart({
  data
}: IDashboardRingChartProps) {
  const ref = useRef<HTMLCanvasElement>(null)
  const total = useMemo(() => data?.reduce((res, v) => res + Number(v.total_amount), 0) || 0, [data])
  const colors = useMemo(() => {
    if(data) {
      const len = data.length
      const res = []
      for(let i = 0; i < len; i++) {
        const percent = i / len
        // 246, 235, 216
        res.push(`rgba(${224 + Math.floor(246 - 224) * percent}, ${187 + Math.floor(235 - 187) * percent}, ${124 + Math.floor((216 - 124) * percent)}, 1)`)
      }
      return res
    }
    return []
  }, [data])

  useEffect(() => {
    if(ref.current && data && data.length > 0) {
      const myCanvas = ref.current as HTMLCanvasElement
      const width = 200
      myCanvas.width = width
      myCanvas.height = width
      const ctx = myCanvas.getContext("2d") as CanvasRenderingContext2D;
      ctx.clearRect(0, 0, width, width)

      // 画背景圆
      ctx.beginPath();
      ctx.fillStyle = 'rgba(224, 187, 124, .2)'
      ctx.arc(width/2, width/2, width/3, 0, 2*Math.PI);
      ctx.fill()

      let startAngle = 0
      let endAngle = 0
      for(let i = 0; i < data.length; i++) {
        const item = data[i]
        const color = colors[i]

        if(startAngle === 0) {
          startAngle = -2*Math.PI*1/4
        } else {
          startAngle = endAngle
        }

        endAngle = startAngle + Math.PI * (Number(item.total_amount) / total * 2)

        // 先画外边框
        // 画外边框
        ctx.beginPath();
        ctx.strokeStyle = color
        ctx.lineWidth = 10
        ctx.arc(width/2, width/2, width/3, startAngle, endAngle, false)
        ctx.stroke();

        ((color, endAngle) => {
          setTimeout(() => {
            ctx.beginPath();
            ctx.fillStyle = color
            const angle = endAngle / 2*Math.PI / 10 * 360
            ctx.arc(
              width/2 + Math.cos(angle * Math.PI / 180) * width/3,
              width/2 + Math.sin(angle * Math.PI / 180) * width/3,
              8,
              0,
              2*Math.PI
            )
            ctx.fill()
          })
        })(color, endAngle)
      }
    }
  }, [data])

  return <div className={classNames(css.dashboardRingChart, 'dashboardRingChart')}>
    <canvas ref={ref} id="test" />
    <ul className={css.list}>
      {data?.map((v, i) => (
        <li key={v.type}>
          <span style={{ backgroundColor: colors[i] }} />
          {v.type}
        </li>
      ))}
    </ul>
  </div>
}

export default DashboardRingChart