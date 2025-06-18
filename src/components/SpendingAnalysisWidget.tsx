import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface SpendingDataPoint {
  category: string;
  spent: number;
  fill: string; // For per-category color using HSL variables
}

interface SpendingAnalysisWidgetProps {
  initialTimePeriod?: '7d' | '30d' | '90d' | '1y';
  title?: string;
  description?: string;
}

const SpendingAnalysisWidget: React.FC<SpendingAnalysisWidgetProps> = ({
  initialTimePeriod = '30d',
  title = "Spending Analysis",
  description = "Visualize your spending by category over selected time periods."
}) => {
  console.log('SpendingAnalysisWidget loaded');
  const [activeTimePeriod, setActiveTimePeriod] = useState<string>(initialTimePeriod);

  const timePeriods = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' },
  ];

  // Placeholder data generation logic
  // In a real app, this data would come from an API
  const getSpendingData = (period: string): SpendingDataPoint[] => {
    const categories = [
      { name: 'Groceries', fill: 'hsl(var(--chart-1))' }, // Assumes CSS variables --chart-1 to --chart-5 are defined
      { name: 'Transport', fill: 'hsl(var(--chart-2))' },
      { name: 'Bills', fill: 'hsl(var(--chart-3))' },
      { name: 'Entertainment', fill: 'hsl(var(--chart-4))' },
      { name: 'Shopping', fill: 'hsl(var(--chart-5))' },
    ];

    let maxSpent: number;
    switch (period) {
      case '7d':
        maxSpent = 150;
        break;
      case '30d':
        maxSpent = 600;
        break;
      case '90d':
        maxSpent = 1800;
        break;
      case '1y':
        maxSpent = 7000;
        break;
      default:
        maxSpent = 600;
    }

    return categories.map(cat => ({
      category: cat.name,
      spent: Math.floor(Math.random() * maxSpent) + Math.floor(maxSpent / 10),
      fill: cat.fill,
    }));
  };

  const chartData = getSpendingData(activeTimePeriod);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6 space-y-4">
        <Tabs value={activeTimePeriod} onValueChange={setActiveTimePeriod} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1.5">
            {timePeriods.map(tp => (
              <TabsTrigger key={tp.value} value={tp.value}>{tp.label}</TabsTrigger>
            ))}
          </TabsList>
          {/* No TabsContent needed as the chart re-renders based on activeTimePeriod state directly */}
        </Tabs>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 5, // Adjusted for better fit if labels are short
                left: -10, // Adjusted for y-axis labels like $1000
                bottom: 5,
              }}
              barGap={4} // Space between bars of different categories
              barCategoryGap="20%" // Space between bars within the same category (if multiple bars per category)
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="category"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={12}
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(value) => `$${value}`}
                width={45} // Give more space for Y-axis labels like $1000
              />
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted))', radius: 4 }}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderRadius: '0.5rem',
                  border: '1px solid hsl(var(--border))',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                }}
                labelStyle={{ fontWeight: 'bold', color: 'hsl(var(--foreground))' }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Bar dataKey="spent" radius={[4, 4, 0, 0]} >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpendingAnalysisWidget;