"use client"

import {
  LineChart as RechartsLineChart,
  BarChart as RechartsBarChart,
  PieChart as RechartsPieChart,
  AreaChart as RechartsAreaChart,
  Line,
  Bar,
  Pie,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  type TooltipProps,
} from "recharts"
import { cn } from "@/lib/utils"

const chartColors = {
  teal: "#14b8a6",
  tealLight: "#5eead4",
  blue: "#3b82f6",
  purple: "#8b5cf6",
  orange: "#f97316",
  pink: "#ec4899",
  red: "#ef4444",
  yellow: "#eab308",
  green: "#22c55e",
  cyan: "#06b6d4",
}

const defaultColors = [
  chartColors.teal,
  chartColors.blue,
  chartColors.purple,
  chartColors.orange,
  chartColors.pink,
  chartColors.red,
  chartColors.yellow,
  chartColors.green,
  chartColors.cyan,
]

interface ChartWrapperProps {
  children: React.ReactElement
  className?: string
}

function ChartWrapper({ children, className }: ChartWrapperProps) {
  return (
    <div className={cn("h-[300px] w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  )
}

interface BaseChartProps {
  data: Record<string, unknown>[]
  xKey: string
  yKey: string
  color?: string
  colors?: string[]
  className?: string
  showGrid?: boolean
  showTooltip?: boolean
  showLegend?: boolean
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  labelKey?: string
}

function CustomTooltip({ active, payload, label, labelKey }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null
  return (
    <div className="rounded-lg border border-dark-100 bg-dark-500 px-3 py-2 shadow-xl">
      <p className="text-xs text-dark-100">{labelKey ? payload[0]?.payload[labelKey] ?? label : label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-medium" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  )
}

function LineChart({
  data,
  xKey,
  yKey,
  color = chartColors.teal,
  className,
  showGrid = true,
  showTooltip = true,
  showLegend = false,
}: BaseChartProps) {
  return (
    <ChartWrapper className={className}>
      <RechartsLineChart data={data as Record<string, string | number>[]}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />}
        <XAxis dataKey={xKey} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        {showTooltip && <Tooltip content={<CustomTooltip />} />}
        {showLegend && <Legend />}
        <Line
          type="monotone"
          dataKey={yKey}
          stroke={color}
          strokeWidth={2}
          dot={{ fill: color, strokeWidth: 2 }}
          activeDot={{ r: 6 }}
        />
      </RechartsLineChart>
    </ChartWrapper>
  )
}

function BarChart({
  data,
  xKey,
  yKey,
  color = chartColors.teal,
  className,
  showGrid = true,
  showTooltip = true,
  showLegend = false,
}: BaseChartProps) {
  return (
    <ChartWrapper className={className}>
      <RechartsBarChart data={data as Record<string, string | number>[]}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />}
        <XAxis dataKey={xKey} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        {showTooltip && <Tooltip content={<CustomTooltip />} />}
        {showLegend && showLegend && <Legend />}
        <Bar dataKey={yKey} fill={color} radius={[4, 4, 0, 0]} />
      </RechartsBarChart>
    </ChartWrapper>
  )
}

interface PieChartProps {
  data: { name: string; value: number }[]
  colors?: string[]
  className?: string
  showTooltip?: boolean
  showLegend?: boolean
  innerRadius?: number
}

function PieChart({
  data,
  colors = defaultColors,
  className,
  showTooltip = true,
  showLegend = false,
  innerRadius = 0,
}: PieChartProps) {
  return (
    <ChartWrapper className={className}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        {showTooltip && <Tooltip content={<CustomTooltip labelKey="name" />} />}
        {showLegend && <Legend />}
      </RechartsPieChart>
    </ChartWrapper>
  )
}

function AreaChart({
  data,
  xKey,
  yKey,
  color = chartColors.teal,
  className,
  showGrid = true,
  showTooltip = true,
  showLegend = false,
}: BaseChartProps) {
  return (
    <ChartWrapper className={className}>
      <RechartsAreaChart data={data as Record<string, string | number>[]}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />}
        <XAxis dataKey={xKey} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        {showTooltip && <Tooltip content={<CustomTooltip />} />}
        {showLegend && showLegend && <Legend />}
        <defs>
          <linearGradient id={`gradient-${yKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey={yKey}
          stroke={color}
          strokeWidth={2}
          fill={`url(#gradient-${yKey})`}
        />
      </RechartsAreaChart>
    </ChartWrapper>
  )
}

export { LineChart, BarChart, PieChart, AreaChart, chartColors, defaultColors }
