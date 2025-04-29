// src/app/[locale]/(protected)/dashboard/_components/AccountsCreatedChart.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { fetchMockUsers } from "../_mocks/fetchMockUsers";
import { User } from "@/types/entities/user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AccountsCreatedChart = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchMockUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Process data for charts by role type
  const processDataByRole = () => {
    // For demo purposes, let's simulate role distribution
    const roleDistribution = [
      { name: "ORGANIZER", value: 12 },
      { name: "JUDGE", value: 18 },
      { name: "ADMIN", value: 5 },
      { name: "TEAM_LEADER", value: 25 },
      { name: "MENTOR", value: 15 },
      { name: "TEAM_MEMBER", value: 45 },
    ];

    return roleDistribution;
  };

  // Process data for time-based charts
  const processDataByTimeframe = (
    timeframe: "day" | "week" | "month" | "year"
  ) => {
    const now = new Date();
    const counts: Record<string, Record<string, number>> = {};
    const roleNames = [
      "ORGANIZER",
      "JUDGE",
      "ADMIN",
      "TEAM_LEADER",
      "MENTOR",
      "TEAM_MEMBER",
    ];

    // Set up initial counts based on timeframe
    if (timeframe === "day") {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const key = date.toISOString().split("T")[0];
        counts[key] = {};
        roleNames.forEach((role) => {
          counts[key][role] = 0;
        });
      }
    } else if (timeframe === "week") {
      // Last 4 weeks
      for (let i = 3; i >= 0; i--) {
        const weekKey = `Week ${4 - i}`;
        counts[weekKey] = {};
        roleNames.forEach((role) => {
          counts[weekKey][role] = 0;
        });
      }
    } else if (timeframe === "month") {
      // Last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const monthKey = monthNames[date.getMonth()];
        counts[monthKey] = {};
        roleNames.forEach((role) => {
          counts[monthKey][role] = 0;
        });
      }
    } else if (timeframe === "year") {
      // Last 3 years
      for (let i = 2; i >= 0; i--) {
        const date = new Date(now);
        date.setFullYear(date.getFullYear() - i);
        const yearKey = date.getFullYear().toString();
        counts[yearKey] = {};
        roleNames.forEach((role) => {
          counts[yearKey][role] = 0;
        });
      }
    }

    // For the demo, just randomly distribute users
    Object.keys(counts).forEach((timeKey) => {
      roleNames.forEach((role) => {
        counts[timeKey][role] = Math.floor(Math.random() * 10) + 1; // Random number between 1-10
      });
    });

    // Format data for stacked bar chart
    return Object.entries(counts).map(([name, roleData]) => {
      return {
        name,
        ...roleData,
      };
    });
  };

  const roleData = processDataByRole();
  const dayData = processDataByTimeframe("day");
  const weekData = processDataByTimeframe("week");
  const monthData = processDataByTimeframe("month");
  const yearData = processDataByTimeframe("year");

  // Colors for pie chart segments
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

  if (isLoading) {
    return (
      <Card className="h-full w-full">
        <CardHeader>
          <CardTitle>User Accounts Created</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-6">
          <p>Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle>User Accounts Created</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Role Distribution</TabsTrigger>
            <TabsTrigger value="day">Daily</TabsTrigger>
            <TabsTrigger value="week">Weekly</TabsTrigger>
            <TabsTrigger value="month">Monthly</TabsTrigger>
            <TabsTrigger value="year">Yearly</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {roleData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          {/* For time-based tabs, we would normally show stacked bar charts */}
          {/* For simplicity, I'm showing summary numbers for now */}
          <TabsContent value="day">
            <div className="grid grid-cols-3 gap-4">
              {dayData.map((day, index) => (
                <Card key={index} className="p-4">
                  <h3 className="text-sm font-medium">{day.name}</h3>
                  <p className="text-2xl font-bold">
                    {Object.values(day).reduce(
                      (a, b) => (typeof b === "number" ? a + b : a),
                      0
                    ) - 1}
                  </p>
                  <div className="mt-2 text-xs">
                    {Object.entries(day).map(([key, value]) =>
                      key !== "name" ? (
                        <div key={key}>
                          {key}: {value}
                        </div>
                      ) : null
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="week">
            <div className="grid grid-cols-2 gap-4">
              {weekData.map((week, index) => (
                <Card key={index} className="p-4">
                  <h3 className="text-sm font-medium">{week.name}</h3>
                  <p className="text-2xl font-bold">
                    {Object.values(week).reduce(
                      (a, b) => (typeof b === "number" ? a + b : a),
                      0
                    ) - 1}
                  </p>
                  <div className="mt-2 text-xs">
                    {Object.entries(week).map(([key, value]) =>
                      key !== "name" ? (
                        <div key={key}>
                          {key}: {value}
                        </div>
                      ) : null
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="month">
            <div className="grid grid-cols-3 gap-4">
              {monthData.map((month, index) => (
                <Card key={index} className="p-4">
                  <h3 className="text-sm font-medium">{month.name}</h3>
                  <p className="text-2xl font-bold">
                    {Object.values(month).reduce(
                      (a, b) => (typeof b === "number" ? a + b : a),
                      0
                    ) - 1}
                  </p>
                  <div className="mt-2 text-xs">
                    {Object.entries(month).map(([key, value]) =>
                      key !== "name" ? (
                        <div key={key}>
                          {key}: {value}
                        </div>
                      ) : null
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="year">
            <div className="grid grid-cols-3 gap-4">
              {yearData.map((year, index) => (
                <Card key={index} className="p-4">
                  <h3 className="text-sm font-medium">{year.name}</h3>
                  <p className="text-2xl font-bold">
                    {Object.values(year).reduce(
                      (a, b) => (typeof b === "number" ? a + b : a),
                      0
                    ) - 1}
                  </p>
                  <div className="mt-2 text-xs">
                    {Object.entries(year).map(([key, value]) =>
                      key !== "name" ? (
                        <div key={key}>
                          {key}: {value}
                        </div>
                      ) : null
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AccountsCreatedChart;
