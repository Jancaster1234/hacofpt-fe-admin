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
import { User } from "@/types/entities/user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { userService } from "@/services/user.service";

const AccountsCreatedChart = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await userService.getAllUsers();
        setUsers(response.data);
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
    // Count users by role
    const roleCounts: Record<string, number> = {};

    users.forEach((user) => {
      if (user.userRoles && user.userRoles.length > 0) {
        user.userRoles.forEach((userRole) => {
          if (userRole.role?.name) {
            const roleName = userRole.role.name;
            roleCounts[roleName] = (roleCounts[roleName] || 0) + 1;
          }
        });
      }
    });

    // Convert to array format for chart
    return Object.entries(roleCounts).map(([name, value]) => ({
      name,
      value,
    }));
  };

  // Process data for time-based charts
  const processDataByTimeframe = (
    timeframe: "day" | "week" | "month" | "year"
  ) => {
    const now = new Date();
    const counts: Record<string, Record<string, number>> = {};
    const roleNames = new Set<string>();

    // Collect all role names first
    users.forEach((user) => {
      if (user.userRoles && user.userRoles.length > 0) {
        user.userRoles.forEach((userRole) => {
          if (userRole.role?.name) {
            roleNames.add(userRole.role.name);
          }
        });
      }
    });

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

    // Process actual user data
    users.forEach((user) => {
      if (!user.createdAt) return;

      const createdDate = new Date(user.createdAt);
      let timeKey: string | null = null;

      if (timeframe === "day") {
        // Check if within last 7 days
        const dayDiff = Math.floor(
          (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (dayDiff < 7) {
          timeKey = createdDate.toISOString().split("T")[0];
        }
      } else if (timeframe === "week") {
        // Check if within last 4 weeks
        const weekDiff = Math.floor(
          (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24 * 7)
        );
        if (weekDiff < 4) {
          timeKey = `Week ${4 - weekDiff}`;
        }
      } else if (timeframe === "month") {
        // Check if within last 6 months
        const monthDiff =
          (now.getFullYear() - createdDate.getFullYear()) * 12 +
          now.getMonth() -
          createdDate.getMonth();
        if (monthDiff < 6) {
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
          timeKey = monthNames[createdDate.getMonth()];
        }
      } else if (timeframe === "year") {
        // Check if within last 3 years
        const yearDiff = now.getFullYear() - createdDate.getFullYear();
        if (yearDiff < 3) {
          timeKey = createdDate.getFullYear().toString();
        }
      }

      // If we found a valid timeKey, increment the counts
      if (timeKey && counts[timeKey]) {
        if (user.userRoles && user.userRoles.length > 0) {
          user.userRoles.forEach((userRole) => {
            if (
              userRole.role?.name &&
              counts[timeKey] &&
              counts[timeKey][userRole.role.name] !== undefined
            ) {
              counts[timeKey][userRole.role.name]++;
            }
          });
        }
      }
    });

    // Format data for chart
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

  // Calculate total users for a specific timeframe entry
  const calculateTotalUsers = (entry: Record<string, any>) => {
    // Only sum numeric values and exclude the "name" property
    return Object.entries(entry)
      .filter(([key, value]) => key !== "name" && typeof value === "number")
      .reduce((sum, [_, value]) => sum + (value as number), 0);
  };

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

          <TabsContent value="day">
            <div className="grid grid-cols-3 gap-4">
              {dayData.map((day, index) => (
                <Card key={index} className="p-4">
                  <h3 className="text-sm font-medium">{day.name}</h3>
                  <p className="text-2xl font-bold">
                    {calculateTotalUsers(day)}
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
                    {calculateTotalUsers(week)}
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
                    {calculateTotalUsers(month)}
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
                    {calculateTotalUsers(year)}
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
