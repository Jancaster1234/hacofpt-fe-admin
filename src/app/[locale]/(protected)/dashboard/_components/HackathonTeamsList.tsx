// src/app/[locale]/(protected)/dashboard/_components/HackathonTeamsList.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Hackathon } from "@/types/entities/hackathon";
import { teamService } from "@/services/team.service";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HackathonTeamsListProps {
  hackathonsData: Hackathon[];
  isLoading: boolean;
}

const HackathonTeamsList = ({
  hackathonsData,
  isLoading,
}: HackathonTeamsListProps) => {
  const [hackathonTeamsCount, setHackathonTeamsCount] = useState<
    Record<string, number>
  >({});
  const [view, setView] = useState<"all" | "active" | "upcoming" | "past">(
    "all"
  );
  const [teamsLoading, setTeamsLoading] = useState(true);
  const { locale } = useParams();

  useEffect(() => {
    const loadTeamsData = async () => {
      try {
        if (hackathonsData.length === 0) return;

        // For each hackathon, fetch its teams and count them
        const teamsCountMap: Record<string, number> = {};

        for (const hackathon of hackathonsData) {
          const teamsResponse = await teamService.getTeamsByHackathonId(
            hackathon.id
          );
          teamsCountMap[hackathon.id] = teamsResponse.data.length;
        }

        setHackathonTeamsCount(teamsCountMap);
      } catch (error) {
        console.error("Failed to load teams data:", error);
      } finally {
        setTeamsLoading(false);
      }
    };

    if (!isLoading) {
      loadTeamsData();
    }
  }, [hackathonsData, isLoading]);

  const filteredHackathons = () => {
    const now = new Date();

    switch (view) {
      case "active":
        return hackathonsData.filter((h) => h.status === "ACTIVE");
      case "upcoming":
        return hackathonsData.filter((h) => new Date(h.startDate) > now);
      case "past":
        return hackathonsData.filter((h) => new Date(h.endDate) < now);
      default:
        return hackathonsData;
    }
  };

  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle>Hackathon Team Participation</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="all"
          onValueChange={(value) => setView(value as any)}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Hackathons</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          {isLoading || teamsLoading ? (
            <div className="flex h-60 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            </div>
          ) : (
            <div className="max-h-96 overflow-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-2 text-left dark:bg-meta-4">
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Hackathon
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Status
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Date
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Teams
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHackathons().map((hackathon) => (
                    <tr key={hackathon.id}>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <h5 className="font-medium text-black dark:text-white">
                          {hackathon.title}
                        </h5>
                        <p className="text-sm text-body">
                          {hackathon.subtitle}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <span
                          className={`inline-block rounded px-2.5 py-0.5 text-sm font-medium ${
                            hackathon.status === "ACTIVE"
                              ? "bg-green-50 text-green-600"
                              : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {hackathon.status}
                        </span>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {new Date(hackathon.startDate).toLocaleDateString()} -{" "}
                          {new Date(hackathon.endDate).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <span className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-primary text-white">
                          {hackathonTeamsCount[hackathon.id] || 0}
                        </span>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <Link
                          href={`/${locale}/hackathon/${hackathon.id}`}
                          className="inline-flex items-center justify-center rounded-md bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700 border border-primary py-2 px-4 text-center font-medium hover:text-white lg:px-6 xl:px-7"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HackathonTeamsList;
