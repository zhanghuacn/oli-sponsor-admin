import { useEffect, useRef } from "react"
import * as echarts from 'echarts/core';
import { GridComponent, GridComponentOption } from 'echarts/components';
import { LineChart, LineSeriesOption } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import css from './index.module.less'
import classNames from "classnames";

echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition]);

type EChartsOption = echarts.ComposeOption<
  GridComponentOption | LineSeriesOption
>;

export interface IDashboardLineChartProps {
  className?: string
  data: number[]
}

function DashboardLineChart({
  className,
  data
}: IDashboardLineChartProps) {
  const div = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if(div.current) {
      const myChart = echarts.init(div.current);
      myChart.setOption({
        xAxis: {
          type: 'category',
          boundaryGap: false,
          show: false
        },
        yAxis: {
          type: 'value',
          show: false
        },
        series: [
          {
            data,
            type: 'line',
            symbol: 'none',
            smooth: true,
            lineStyle: {
              color: '#E0BB7C',
              width: 4,
              cap: 'round',
              join: 'round',
              shadowColor: '#F8EAD9',
              shadowBlur: 5,
              shadowOffsetY: 6
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: '#FFF9F3' // 0% 处的颜色
                }, {
                    offset: 1, color: '#fff' // 100% 处的颜色
                }],
              }
            }
          }
        ]
      } as EChartsOption)
    }
  }, [data])

  return <div ref={div} className={classNames(css.mineLineChart, className)} />
}

export default DashboardLineChart