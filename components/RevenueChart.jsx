'use client'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

const data = [
  { month: 'Jan', revenue: 1200 },
  { month: 'Feb', revenue: 2100 },
  { month: 'Mar', revenue: 1800 },
  { month: 'Apr', revenue: 3200 },
  { month: 'May', revenue: 2800 },
  { month: 'Jun', revenue: 4100 },
]

export default function RevenueChart() {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        
        <LineChart data={data}>
          
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#10b981"
            strokeWidth={3}
          />

        </LineChart>

      </ResponsiveContainer>
    </div>
  )
}