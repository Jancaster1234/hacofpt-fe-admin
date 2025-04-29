// src/app/[locale]/(protected)/dashboard/_components/HackathonTeamsList.tsx
"use client";
import React, { useEffect, useState } from "react";
import { fetchMockHackathons } from "../_mocks/fetchMockHackathons";
import { fetchMockTeams } from "../_mocks/fetchMockTeams";
import { Hackathon } from "@/types/entities/hackathon";
import { Team } from "@/types/entities/team";
import Link from "next/link";
import { useParams } from "next/navigation";

const HackathonTeamsList = () => {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hackathonTeamsCount, setHackathonTeamsCount] = useState<
    Record<string, number>
  >({});
  const { locale } = useParams();

  useEffect(() => {
    const loadData = async () => {
      try {
        const hackathonsData = await fetchMockHackathons();
        setHackathons(hackathonsData);

        // For each hackathon, fetch its teams and count them
        const teamsCountMap: Record<string, number> = {};

        for (const hackathon of hackathonsData) {
          const teams = await fetchMockTeams(hackathon.id);
          teamsCountMap[hackathon.id] = teams.length;
        }

        setHackathonTeamsCount(teamsCountMap);
      } catch (error) {
        console.error("Failed to load hackathons or teams data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="rounded-lg border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Hackathon Team Participation
        </h4>
      </div>

      {isLoading ? (
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
              {hackathons.map((hackathon) => (
                <tr key={hackathon.id}>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <h5 className="font-medium text-black dark:text-white">
                      {hackathon.title}
                    </h5>
                    <p className="text-sm text-body">{hackathon.subtitle}</p>
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
                      className="inline-flex items-center justify-center rounded-md border border-primary py-2 px-4 text-center font-medium text-primary hover:bg-primary hover:text-white lg:px-6 xl:px-7"
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
    </div>
  );
};

export default HackathonTeamsList;
