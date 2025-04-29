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

interface TeamStatsByPeriod {
  day: number;
  week: number;
  month: number;
  year: number;
}

const TeamCreationStats = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState<"day" | "week" | "month" | "year">(
    "day"
  );
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

  const chartData = [
    { name: "Day", Teams: stats.day },
    { name: "Week", Teams: stats.week },
    { name: "Month", Teams: stats.month },
    { name: "Year", Teams: stats.year },
  ];

  const getDisplayData = () => {
    switch (timeFrame) {
      case "day":
        return [{ name: "Today", Teams: stats.day }];
      case "week":
        return [{ name: "This Week", Teams: stats.week }];
      case "month":
        return [{ name: "This Month", Teams: stats.month }];
      case "year":
        return [{ name: "This Year", Teams: stats.year }];
      default:
        return chartData;
    }
  };

  return (
    <div className="rounded-lg border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Teams Created
        </h4>
        <div className="flex space-x-2">
          <button
            className={`rounded px-3 py-1 text-sm ${
              timeFrame === "day"
                ? "bg-primary text-white"
                : "bg-gray-100 text-black dark:bg-meta-4 dark:text-white"
            }`}
            onClick={() => setTimeFrame("day")}
          >
            Day
          </button>
          <button
            className={`rounded px-3 py-1 text-sm ${
              timeFrame === "week"
                ? "bg-primary text-white"
                : "bg-gray-100 text-black dark:bg-meta-4 dark:text-white"
            }`}
            onClick={() => setTimeFrame("week")}
          >
            Week
          </button>
          <button
            className={`rounded px-3 py-1 text-sm ${
              timeFrame === "month"
                ? "bg-primary text-white"
                : "bg-gray-100 text-black dark:bg-meta-4 dark:text-white"
            }`}
            onClick={() => setTimeFrame("month")}
          >
            Month
          </button>
          <button
            className={`rounded px-3 py-1 text-sm ${
              timeFrame === "year"
                ? "bg-primary text-white"
                : "bg-gray-100 text-black dark:bg-meta-4 dark:text-white"
            }`}
            onClick={() => setTimeFrame("year")}
          >
            Year
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-60 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getDisplayData()}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Teams" fill="#3C50E0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default TeamCreationStats;
