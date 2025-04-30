// src/app/[locale]/(protected)/dashboard/_components/MoneySpentStats.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SponsorshipHackathon } from "@/types/entities/sponsorshipHackathon";
import { SponsorshipHackathonDetail } from "@/types/entities/sponsorshipHackathonDetail";
import { Sponsorship } from "@/types/entities/sponsorship";
import { sponsorshipHackathonService } from "@/services/sponsorshipHackathon.service";
import { sponsorshipHackathonDetailService } from "@/services/sponsorshipHackathonDetail.service";

interface TimeframeDataPoint {
  name: string;
  value: number;
}

interface MoneySpentStatsProps {
  sponsorshipsData: Sponsorship[];
  isLoading: boolean;
}

const MoneySpentStats: React.FC<MoneySpentStatsProps> = ({
  sponsorshipsData,
  isLoading,
}) => {
  const [sponsorshipHackathons, setSponsorshipHackathons] = useState<
    SponsorshipHackathon[]
  >([]);
  const [sponsorshipDetails, setSponsorshipDetails] = useState<
    SponsorshipHackathonDetail[]
  >([]);
  const [dayData, setDayData] = useState<TimeframeDataPoint[]>([]);
  const [weekData, setWeekData] = useState<TimeframeDataPoint[]>([]);
  const [monthData, setMonthData] = useState<TimeframeDataPoint[]>([]);
  const [yearData, setYearData] = useState<TimeframeDataPoint[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      // Only proceed if sponsorshipsData is available and not loading
      if (isLoading || !sponsorshipsData.length) {
        return;
      }

      try {
        // Use the sponsorshipsData passed from Dashboard
        const fetchedSponsorships = sponsorshipsData;

        // Fetch all sponsorship hackathons for each sponsorship
        const allSponsorshipHackathons: SponsorshipHackathon[] = [];
        const allSponsorshipDetails: SponsorshipHackathonDetail[] = [];

        for (const sponsorship of fetchedSponsorships) {
          const hackathonsResponse =
            await sponsorshipHackathonService.getSponsorshipHackathonsBySponsorshipId(
              sponsorship.id
            );
          const fetchedHackathons = hackathonsResponse.data;
          allSponsorshipHackathons.push(...fetchedHackathons);

          // Fetch all details for each sponsorship hackathon
          for (const hackathon of fetchedHackathons) {
            const detailsResponse =
              await sponsorshipHackathonDetailService.getSponsorshipHackathonDetailsBySponsorshipHackathonId(
                hackathon.id
              );
            const fetchedDetails = detailsResponse.data;
            allSponsorshipDetails.push(...fetchedDetails);
          }
        }

        setSponsorshipHackathons(allSponsorshipHackathons);
        setSponsorshipDetails(allSponsorshipDetails);

        // Process data for time-based charts
        const timeframeData = processSpendingByTimeframes(
          allSponsorshipDetails
        );
        setDayData(timeframeData.dayData);
        setWeekData(timeframeData.weekData);
        setMonthData(timeframeData.monthData);
        setYearData(timeframeData.yearData);
      } catch (error) {
        console.error("Error fetching money spent data:", error);
      } finally {
        setIsDataLoading(false);
      }
    };

    loadData();
  }, [sponsorshipsData, isLoading]);

  const processSpendingByTimeframes = (
    details: SponsorshipHackathonDetail[]
  ) => {
    const now = new Date();

    // Initialize time periods
    const daySpending: Record<string, number> = {};
    const weekSpending: Record<string, number> = {};
    const monthSpending: Record<string, number> = {};
    const yearSpending: Record<string, number> = {};

    // Initialize day data (last 7 days)
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split("T")[0];
      daySpending[key] = 0;
    }

    // Initialize week data (last 4 weeks)
    for (let i = 3; i >= 0; i--) {
      const weekKey = `Week ${4 - i}`;
      weekSpending[weekKey] = 0;
    }

    // Initialize month data (last 6 months)
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
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      const monthKey = monthNames[date.getMonth()];
      monthSpending[monthKey] = 0;
    }

    // Initialize year data (last 3 years)
    for (let i = 2; i >= 0; i--) {
      const date = new Date(now);
      date.setFullYear(date.getFullYear() - i);
      const yearKey = date.getFullYear().toString();
      yearSpending[yearKey] = 0;
    }

    // Process each detail to populate spending data
    details.forEach((detail) => {
      if (detail.status === "COMPLETED") {
        const timeFrom = new Date(detail.timeFrom);
        const timeTo = new Date(detail.timeTo);
        const moneySpent = detail.moneySpent;

        // Daily data
        Object.keys(daySpending).forEach((dayKey) => {
          const day = new Date(dayKey);
          if (timeFrom <= day && day <= timeTo) {
            daySpending[dayKey] +=
              moneySpent /
              Math.max(
                1,
                (timeTo.getTime() - timeFrom.getTime()) / (1000 * 60 * 60 * 24)
              );
          }
        });

        // Weekly data
        const fourWeeksAgo = new Date(now);
        fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

        if (timeFrom <= now && timeTo >= fourWeeksAgo) {
          // Distribute money across weeks
          Object.keys(weekSpending).forEach((weekKey, index) => {
            const weekStart = new Date(now);
            weekStart.setDate(weekStart.getDate() - (28 - index * 7));
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);

            if (timeFrom <= weekEnd && timeTo >= weekStart) {
              const overlapStart = new Date(
                Math.max(timeFrom.getTime(), weekStart.getTime())
              );
              const overlapEnd = new Date(
                Math.min(timeTo.getTime(), weekEnd.getTime())
              );
              const overlapDays = Math.max(
                0,
                (overlapEnd.getTime() - overlapStart.getTime()) /
                  (1000 * 60 * 60 * 24)
              );
              const totalDetailDays = Math.max(
                1,
                (timeTo.getTime() - timeFrom.getTime()) / (1000 * 60 * 60 * 24)
              );

              weekSpending[weekKey] +=
                (overlapDays / totalDetailDays) * moneySpent;
            }
          });
        }

        // Monthly data
        const sixMonthsAgo = new Date(now);
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

        if (timeFrom <= now && timeTo >= sixMonthsAgo) {
          Object.keys(monthSpending).forEach((monthKey, index) => {
            const monthIndex = monthNames.indexOf(monthKey);
            const monthDate = new Date(now);
            monthDate.setMonth(now.getMonth() - 5 + index);
            monthDate.setDate(1);

            const nextMonth = new Date(monthDate);
            nextMonth.setMonth(monthDate.getMonth() + 1);

            if (timeFrom < nextMonth && timeTo >= monthDate) {
              const overlapStart = new Date(
                Math.max(timeFrom.getTime(), monthDate.getTime())
              );
              const overlapEnd = new Date(
                Math.min(timeTo.getTime(), nextMonth.getTime() - 1)
              );
              const overlapDays = Math.max(
                0,
                (overlapEnd.getTime() - overlapStart.getTime()) /
                  (1000 * 60 * 60 * 24)
              );
              const totalDetailDays = Math.max(
                1,
                (timeTo.getTime() - timeFrom.getTime()) / (1000 * 60 * 60 * 24)
              );

              monthSpending[monthKey] +=
                (overlapDays / totalDetailDays) * moneySpent;
            }
          });
        }

        // Yearly data
        const threeYearsAgo = new Date(now);
        threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 2);

        if (timeFrom <= now && timeTo >= threeYearsAgo) {
          Object.keys(yearSpending).forEach((yearKey) => {
            const year = parseInt(yearKey);
            const yearStart = new Date(year, 0, 1);
            const yearEnd = new Date(year, 11, 31, 23, 59, 59);

            if (timeFrom <= yearEnd && timeTo >= yearStart) {
              const overlapStart = new Date(
                Math.max(timeFrom.getTime(), yearStart.getTime())
              );
              const overlapEnd = new Date(
                Math.min(timeTo.getTime(), yearEnd.getTime())
              );
              const overlapDays = Math.max(
                0,
                (overlapEnd.getTime() - overlapStart.getTime()) /
                  (1000 * 60 * 60 * 24)
              );
              const totalDetailDays = Math.max(
                1,
                (timeTo.getTime() - timeFrom.getTime()) / (1000 * 60 * 60 * 24)
              );

              yearSpending[yearKey] +=
                (overlapDays / totalDetailDays) * moneySpent;
            }
          });
        }
      }
    });

    // Convert to chart data format
    return {
      dayData: Object.entries(daySpending).map(([name, value]) => ({
        name,
        value: Math.round(value),
      })),
      weekData: Object.entries(weekSpending).map(([name, value]) => ({
        name,
        value: Math.round(value),
      })),
      monthData: Object.entries(monthSpending).map(([name, value]) => ({
        name,
        value: Math.round(value),
      })),
      yearData: Object.entries(yearSpending).map(([name, value]) => ({
        name,
        value: Math.round(value),
      })),
    };
  };

  // Enhanced spending data for the detailed table
  const getDetailedSpendingData = () => {
    // Combine data from sponsorships and details for a comprehensive view
    const detailedData = [];

    for (const detail of sponsorshipDetails) {
      // Find related sponsorship hackathon
      const sponsorshipHackathon = sponsorshipHackathons.find(
        (sh) => sh.id === detail.sponsorshipHackathonId
      );

      if (!sponsorshipHackathon) continue;

      // Find related sponsorship
      const sponsorship = sponsorshipsData.find(
        (s) => s.id === sponsorshipHackathon.sponsorshipId
      );

      if (!sponsorship) continue;

      detailedData.push({
        id: detail.id,
        sponsorshipName: sponsorship.name,
        brand: sponsorship.brand,
        amount: detail.moneySpent,
        status: detail.status,
        description: detail.content,
        timeFrom: new Date(detail.timeFrom).toLocaleDateString(),
        timeTo: new Date(detail.timeTo).toLocaleDateString(),
        createdAt: new Date(detail.createdAt).toLocaleDateString(),
      });
    }

    return detailedData;
  };

  const detailedData = getDetailedSpendingData();

  // Calculate total money spent
  const totalMoneySpent = sponsorshipDetails.reduce(
    (sum, detail) => sum + detail.moneySpent,
    0
  );

  // Show loading state if either parent is loading or component is loading its own data
  if (isLoading || isDataLoading) {
    return (
      <Card className="h-full w-full">
        <CardHeader>
          <CardTitle>Money Spent Statistics</CardTitle>
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
        <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <span>Money Spent Statistics</span>
          <span className="text-lg font-medium text-gray-600">
            Total: ${totalMoneySpent.toLocaleString()}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="timeframe" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="timeframe">By Timeframe</TabsTrigger>
            <TabsTrigger value="details">Detailed Table</TabsTrigger>
          </TabsList>

          <TabsContent value="timeframe">
            <Tabs defaultValue="day" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="day">Daily</TabsTrigger>
                <TabsTrigger value="week">Weekly</TabsTrigger>
                <TabsTrigger value="month">Monthly</TabsTrigger>
                <TabsTrigger value="year">Yearly</TabsTrigger>
              </TabsList>

              <TabsContent value="day">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dayData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => `$${value.toLocaleString()}`}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="value"
                        name="Money Spent"
                        fill="#8884d8"
                        stroke="#8884d8"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="week">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weekData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => `$${value.toLocaleString()}`}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="value"
                        name="Money Spent"
                        fill="#82ca9d"
                        stroke="#82ca9d"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="month">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => `$${value.toLocaleString()}`}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="value"
                        name="Money Spent"
                        fill="#ffc658"
                        stroke="#ffc658"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="year">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={yearData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => `$${value.toLocaleString()}`}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        name="Money Spent"
                        stroke="#FF8042"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="details">
            <div className="max-h-[400px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sponsorship</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detailedData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.sponsorshipName}
                      </TableCell>
                      <TableCell>{item.brand}</TableCell>
                      <TableCell>${item.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <span
                          className={`rounded-md px-2 py-1 text-xs font-medium ${
                            item.status === "COMPLETED"
                              ? "bg-green-100 text-green-800"
                              : item.status === "PLANNED"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {item.description}
                      </TableCell>
                      <TableCell>{item.timeFrom}</TableCell>
                      <TableCell>{item.timeTo}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MoneySpentStats;
