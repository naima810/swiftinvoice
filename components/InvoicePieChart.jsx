'use client'

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts'

const data = [
  { name: 'Paid', value: 48 },
  { name: 'Pending', value: 19 },
  { name: 'Overdue', value: 8 },
]

const COLORS = ['#10b981', '#f59e0b', '#ef4444']

export default function InvoicePieChart() {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">

        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />

        </PieChart>

      </ResponsiveContainer>
    </div>
  )
}