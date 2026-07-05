// src/components/cards/spending-charts.tsx
"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, PiggyBank } from "lucide-react";

interface SpendingChartsProps {
  monthlyBreakdown: Record<
    string,
    { income: number; spent: number; saved: number }
  >;
  sourceBreakdown: { sourceType: string; amount: number }[];
}

const COLORS: Record<string, string> = {
  WISHLIST: "#f43f5e",
  SHOPPING: "#10b981",
  DATE_OUTING: "#ec4899",
  MANUAL: "#f59e0b",
};

const SOURCE_LABELS: Record<string, string> = {
  WISHLIST: "Wishlist",
  SHOPPING: "Shopping",
  DATE_OUTING: "Date Outing",
  MANUAL: "Manual",
};

// Custom tooltip for bar chart
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3 text-xs sm:text-sm">
        <p className="font-bold mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: ${entry.value.toFixed(2)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Custom tooltip for pie chart
const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3 text-xs sm:text-sm">
        <p className="font-bold" style={{ color: data.payload.color }}>
          {SOURCE_LABELS[data.name] || data.name}
        </p>
        <p>${data.value.toFixed(2)}</p>
        <p>{((data.percent || 0) * 100).toFixed(1)}%</p>
      </div>
    );
  }
  return null;
};

// Custom legend for pie chart
const renderPieLegend = (props: any) => {
  const { payload } = props;
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-2">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-1.5 text-[10px] sm:text-xs">
          <div
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">
            {SOURCE_LABELS[entry.value] || entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export function SpendingCharts({
  monthlyBreakdown,
  sourceBreakdown,
}: SpendingChartsProps) {
  // Prepare bar chart data
  const barData = Object.entries(monthlyBreakdown)
    .slice(-12) // Last 12 months
    .map(([key, data]) => {
      const [year, month] = key.split("-");
      const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];
      return {
        name: `${monthNames[parseInt(month) - 1]} ${year.slice(2)}`,
        Income: data.income,
        Spent: data.spent,
        Saved: data.saved,
      };
    });

  // Prepare pie chart data
  const pieData = sourceBreakdown
    .filter((s) => s.amount > 0)
    .map((s) => ({
      name: s.sourceType,
      value: s.amount,
      color: COLORS[s.sourceType] || "#6b7280",
    }));

  const hasBarData = barData.length > 0 && barData.some((d) => d.Income > 0 || d.Spent > 0);
  const hasPieData = pieData.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Bar Chart - Income vs Spent */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            Income vs Spending
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!hasBarData ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <PiggyBank className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-xs sm:text-sm">No data for this period</p>
            </div>
          ) : (
            <div className="h-[250px] sm:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 5, right: 5, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10 }}
                    className="text-muted-foreground text-[10px] sm:text-xs"
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 10 }}
                    className="text-muted-foreground text-[10px] sm:text-xs"
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: "10px" }}
                    iconSize={8}
                  />
                  <Bar
                    dataKey="Income"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                  <Bar
                    dataKey="Spent"
                    fill="#f43f5e"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pie/Donut Chart - Source Breakdown */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-rose-500" />
            Spending by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!hasPieData ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <PiggyBank className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-xs sm:text-sm">No spending data yet</p>
            </div>
          ) : (
            <div className="h-[250px] sm:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={1}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend content={renderPieLegend} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}