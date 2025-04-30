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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Sponsorship } from "@/types/entities/sponsorship";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sponsorshipService } from "@/services/sponsorship.service";

const SponsorshipsStats = () => {
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await sponsorshipService.getAllSponsorships();
        setSponsorships(response.data);
      } catch (error) {
        console.error("Error fetching sponsorship data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Process data for charts - categorize by brand
  const processSponsorshipsByBrand = () => {
    const brandMap: Record<string, number> = {};

    sponsorships.forEach((sponsorship) => {
      if (!brandMap[sponsorship.brand]) {
        brandMap[sponsorship.brand] = 0;
      }
      brandMap[sponsorship.brand]++;
    });

    return Object.entries(brandMap).map(([name, value]) => ({ name, value }));
  };

  // Process data for charts - categorize by admin
  const processSponsorshipsByAdmin = () => {
    const adminMap: Record<string, number> = {};

    sponsorships.forEach((sponsorship) => {
      if (!adminMap[sponsorship.createdByUserName]) {
        adminMap[sponsorship.createdByUserName] = 0;
      }
      adminMap[sponsorship.createdByUserName]++;
    });

    return Object.entries(adminMap).map(([name, value]) => ({ name, value }));
  };

  // Process data for time-based metrics using actual data
  const processDataByTimeframe = (
    timeframe: "day" | "week" | "month" | "year"
  ) => {
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

    // Process actual sponsorship data
    sponsorships.forEach((sponsorship) => {
      // Use creation date for the timeframe statistics
      const creationDate = new Date(sponsorship.createdAt);

      if (timeframe === "day") {
        // Check if creation date is within the last 7 days
        if (now.getTime() - creationDate.getTime() <= 7 * 24 * 60 * 60 * 1000) {
          const key = creationDate.toISOString().split("T")[0];
          if (counts.hasOwnProperty(key)) {
            counts[key]++;
          }
        }
      } else if (timeframe === "week") {
        // Check if creation date is within the last 4 weeks
        if (
          now.getTime() - creationDate.getTime() <=
          4 * 7 * 24 * 60 * 60 * 1000
        ) {
          const weeksSince = Math.floor(
            (now.getTime() - creationDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
          );
          const weekKey = `Week ${weeksSince + 1}`;
          if (counts.hasOwnProperty(weekKey)) {
            counts[weekKey]++;
          }
        }
      } else if (timeframe === "month") {
        // Check if creation date is within the last 6 months
        if (
          now.getTime() - creationDate.getTime() <=
          6 * 30 * 24 * 60 * 60 * 1000
        ) {
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
          const monthKey = monthNames[creationDate.getMonth()];
          if (counts.hasOwnProperty(monthKey)) {
            counts[monthKey]++;
          }
        }
      } else if (timeframe === "year") {
        // Check if creation date is within the last 3 years
        if (
          now.getTime() - creationDate.getTime() <=
          3 * 365 * 24 * 60 * 60 * 1000
        ) {
          const yearKey = creationDate.getFullYear().toString();
          if (counts.hasOwnProperty(yearKey)) {
            counts[yearKey]++;
          }
        }
      }
    });

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const brandData = processSponsorshipsByBrand();
  const adminData = processSponsorshipsByAdmin();
  const dayData = processDataByTimeframe("day");
  const weekData = processDataByTimeframe("week");
  const monthData = processDataByTimeframe("month");
  const yearData = processDataByTimeframe("year");

  // Enhanced sponsorship data for the detailed table
  const getDetailedSponsorshipData = () => {
    return sponsorships.map((s) => ({
      id: s.id,
      name: s.name,
      brand: s.brand,
      money: s.money,
      status: s.status,
      timeFrom: new Date(s.timeFrom).toLocaleDateString(),
      timeTo: new Date(s.timeTo).toLocaleDateString(),
      createdBy: s.createdByUserName,
      createdAt: new Date(s.createdAt).toLocaleDateString(),
    }));
  };

  const detailedData = getDetailedSponsorshipData();

  if (isLoading) {
    return (
      <Card className="h-full w-full">
        <CardHeader>
          <CardTitle>Sponsorships Statistics</CardTitle>
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
        <CardTitle>Sponsorships Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="brand" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="brand">By Brand</TabsTrigger>
            <TabsTrigger value="admin">By Admin</TabsTrigger>
            <TabsTrigger value="timeframe">By Timeframe</TabsTrigger>
            <TabsTrigger value="details">Detailed Table</TabsTrigger>
          </TabsList>

          <TabsContent value="brand">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={brandData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Sponsorships" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="admin">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={adminData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="value"
                    name="Sponsorships Created"
                    fill="#82ca9d"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

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
                    <BarChart data={dayData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Sponsorships" fill="#FF8042" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="week">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weekData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Sponsorships" fill="#FF8042" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="month">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Sponsorships" fill="#FF8042" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="year">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={yearData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Sponsorships" fill="#FF8042" />
                    </BarChart>
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
                    <TableHead>Name</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detailedData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.brand}</TableCell>
                      <TableCell>${item.money.toLocaleString()}</TableCell>
                      <TableCell>
                        <span
                          className={`rounded-md px-2 py-1 text-xs font-medium ${
                            item.status === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : item.status === "COMPLETED"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell>{item.timeFrom}</TableCell>
                      <TableCell>{item.timeTo}</TableCell>
                      <TableCell>{item.createdBy}</TableCell>
                      <TableCell>{item.createdAt}</TableCell>
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

export default SponsorshipsStats;
