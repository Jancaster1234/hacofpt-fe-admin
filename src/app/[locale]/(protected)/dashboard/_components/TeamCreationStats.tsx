// src/app/[locale]/(protected)/dashboard/_components/TeamCreationStats.tsx
"use client";
import React, { useEffect, useState } from "react";
import { fetchMockTeams } from "../_mocks/fetchMockTeams";
import { Team } from "@/types/entities/team";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TeamStatsByPeriod {
  day: number;
  week: number;
  month: number;
  year: number;
}

const TeamCreationStats = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<TeamStatsByPeriod>({
    day: 0,
    week: 0,
    month: 0,
    year: 0,
  });

  useEffect(() => {
    const loadTeams = async () => {
      try {
        // Using a placeholder hackathon ID since we're just interested in team creation data
        const teamsData = await fetchMockTeams("hack1");
        setTeams(teamsData);

        // Calculate stats
        const now = new Date();
        const oneDay = 24 * 60 * 60 * 1000;
        const oneWeek = 7 * oneDay;
        const oneMonth = 30 * oneDay;
        const oneYear = 365 * oneDay;

        const teamsCreatedToday = teamsData.filter((team) => {
          const createdDate = new Date(team.createdAt);
          return now.getTime() - createdDate.getTime() < oneDay;
        }).length;

        const teamsCreatedThisWeek = teamsData.filter((team) => {
          const createdDate = new Date(team.createdAt);
          return now.getTime() - createdDate.getTime() < oneWeek;
        }).length;

        const teamsCreatedThisMonth = teamsData.filter((team) => {
          const createdDate = new Date(team.createdAt);
          return now.getTime() - createdDate.getTime() < oneMonth;
        }).length;

        const teamsCreatedThisYear = teamsData.filter((team) => {
          const createdDate = new Date(team.createdAt);
          return now.getTime() - createdDate.getTime() < oneYear;
        }).length;

        setStats({
          day: teamsCreatedToday,
          week: teamsCreatedThisWeek,
          month: teamsCreatedThisMonth,
          year: teamsCreatedThisYear,
        });
      } catch (error) {
        console.error("Failed to load teams data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTeams();
  }, []);

  const dayData = [{ name: "Today", Teams: stats.day }];
  const weekData = [{ name: "This Week", Teams: stats.week }];
  const monthData = [{ name: "This Month", Teams: stats.month }];
  const yearData = [{ name: "This Year", Teams: stats.year }];
  const allData = [
    { name: "Day", Teams: stats.day },
    { name: "Week", Teams: stats.week },
    { name: "Month", Teams: stats.month },
    { name: "Year", Teams: stats.year },
  ];

  if (isLoading) {
    return (
      <Card className="h-full w-full">
        <CardHeader>
          <CardTitle>Teams Created</CardTitle>
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
        <CardTitle>Teams Created</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={allData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Teams" fill="#3C50E0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="day">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dayData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Teams" fill="#3C50E0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="week">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Teams" fill="#3C50E0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="month">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Teams" fill="#3C50E0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="year">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={yearData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Teams" fill="#3C50E0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TeamCreationStats;
