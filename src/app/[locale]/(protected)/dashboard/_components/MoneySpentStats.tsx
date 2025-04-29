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
import { fetchMockSponsorshipHackathons } from "../_mocks/fetchMockSponsorshipHackathons";
import { fetchMockSponsorshipHackathonDetails } from "../_mocks/fetchMockSponsorshipHackathonDetails";
import { SponsorshipHackathon } from "@/types/entities/sponsorshipHackathon";
import { SponsorshipHackathonDetail } from "@/types/entities/sponsorshipHackathonDetail";
import { fetchMockSponsorships } from "../_mocks/fetchMockSponsorships";
import { Sponsorship } from "@/types/entities/sponsorship";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MoneySpentStats = () => {
  const [sponsorshipHackathons, setSponsorshipHackathons] = useState<
    SponsorshipHackathon[]
  >([]);
  const [sponsorshipDetails, setSponsorshipDetails] = useState<
    SponsorshipHackathonDetail[]
  >([]);
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const hackathonsData = await fetchMockSponsorshipHackathons({});
        const detailsData = await fetchMockSponsorshipHackathonDetails({});
        const sponsorshipsData = await fetchMockSponsorships();

        setSponsorshipHackathons(hackathonsData);
        setSponsorshipDetails(detailsData);
        setSponsorships(sponsorshipsData);
      } catch (error) {
        console.error("Error fetching money spent data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Process data for time-based spending metrics
  const processSpendingByTimeframe = (
    timeframe: "day" | "week" | "month" | "year"
  ) => {
    const now = new Date();
    const spending: Record<string, number> = {};

    // Set up initial spending based on timeframe
    if (timeframe === "day") {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const key = date.toISOString().split("T")[0];
        spending[key] = 0;
      }
    } else if (timeframe === "week") {
      // Last 4 weeks
      for (let i = 3; i >= 0; i--) {
        const weekKey = `Week ${4 - i}`;
        spending[weekKey] = 0;
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
        spending[monthKey] = 0;
      }
    } else if (timeframe === "year") {
      // Last 3 years
      for (let i = 2; i >= 0; i--) {
        const date = new Date(now);
        date.setFullYear(date.getFullYear() - i);
        const yearKey = date.getFullYear().toString();
        spending[yearKey] = 0;
      }
    }

    // For the demo, just randomly distribute spending
    Object.keys(spending).forEach((key) => {
      const baseMoney = Math.floor(Math.random() * 15000) + 5000; // Random amount between $5,000-$20,000
      spending[key] = baseMoney;
    });

    return Object.entries(spending).map(([name, value]) => ({ name, value }));
  };

  // Generate data for the charts
  const dayData = processSpendingByTimeframe("day");
  const weekData = processSpendingByTimeframe("week");
  const monthData = processSpendingByTimeframe("month");
  const yearData = processSpendingByTimeframe("year");

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
      const sponsorship = sponsorships.find(
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

  if (isLoading) {
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
