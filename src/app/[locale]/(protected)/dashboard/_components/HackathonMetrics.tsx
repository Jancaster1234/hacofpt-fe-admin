// src/app/[locale]/(protected)/dashboard/_components/HackathonMetrics.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Hackathon } from "@/types/entities/hackathon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { hackathonService } from "@/services/hackathon.service";

const HackathonMetrics = () => {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await hackathonService.getAllHackathons();
        setHackathons(response.data || []);
      } catch (error) {
        console.error("Error fetching hackathon data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Process data for charts
  const processDataByTimeframe = (
    timeframe: "day" | "week" | "month" | "year"
  ) => {
    if (hackathons.length === 0) return [];

    const now = new Date();
    const counts: Record<string, number> = {};

    // Set up initial counts based on timeframe
    if (timeframe === "day") {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const key = date.toISOString().split("T")[0];
        counts[key] = 0;
      }
    } else if (timeframe === "week") {
      // Last 4 weeks
      for (let i = 3; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i * 7);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekKey = `Week ${4 - i}`;
        counts[weekKey] = 0;
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
        counts[monthKey] = 0;
      }
    } else if (timeframe === "year") {
      // Last 3 years
      for (let i = 2; i >= 0; i--) {
        const date = new Date(now);
        date.setFullYear(date.getFullYear() - i);
        const yearKey = date.getFullYear().toString();
        counts[yearKey] = 0;
      }
    }

    // Count hackathons based on their creation date
    hackathons.forEach((hackathon) => {
      if (!hackathon.createdAt) return;

      const createdDate = new Date(hackathon.createdAt);

      if (timeframe === "day") {
        // Daily view - last 7 days
        const dateKey = createdDate.toISOString().split("T")[0];
        if (counts.hasOwnProperty(dateKey)) {
          counts[dateKey]++;
        }
      } else if (timeframe === "week") {
        // Weekly view - last 4 weeks
        const weeksDiff = Math.floor(
          (now.getTime() - createdDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
        );
        if (weeksDiff < 4) {
          const weekKey = `Week ${4 - weeksDiff}`;
          counts[weekKey]++;
        }
      } else if (timeframe === "month") {
        // Monthly view - last 6 months
        const monthsDiff =
          (now.getFullYear() - createdDate.getFullYear()) * 12 +
          now.getMonth() -
          createdDate.getMonth();
        if (monthsDiff < 6) {
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
          const monthKey = monthNames[createdDate.getMonth()];
          counts[monthKey]++;
        }
      } else if (timeframe === "year") {
        // Yearly view - last 3 years
        const yearsDiff = now.getFullYear() - createdDate.getFullYear();
        if (yearsDiff < 3) {
          const yearKey = createdDate.getFullYear().toString();
          counts[yearKey]++;
        }
      }
    });

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const dayData = processDataByTimeframe("day");
  const weekData = processDataByTimeframe("week");
  const monthData = processDataByTimeframe("month");
  const yearData = processDataByTimeframe("year");

  if (isLoading) {
    return (
      <Card className="h-full w-full">
        <CardHeader>
          <CardTitle>Hackathons Created</CardTitle>
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
        <CardTitle>Hackathons Created</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="day">
          <TabsList className="mb-4">
            <TabsTrigger value="day">Daily</TabsTrigger>
            <TabsTrigger value="week">Weekly</TabsTrigger>
            <TabsTrigger value="month">Monthly</TabsTrigger>
            <TabsTrigger value="year">Yearly</TabsTrigger>
          </TabsList>

          <TabsContent value="day">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dayData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Hackathons" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="week">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Hackathons" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="month">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Hackathons" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="year">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={yearData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Hackathons" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HackathonMetrics;
