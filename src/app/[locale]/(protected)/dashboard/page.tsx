// src/app/[locale]/(protected)/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Hackathon } from "@/types/entities/hackathon";
import { hackathonService } from "@/services/hackathon.service";
import HackathonMetrics from "./_components/HackathonMetrics";
import AccountsCreatedChart from "./_components/AccountsCreatedChart";
import SponsorshipsStats from "./_components/SponsorshipsStats";
import MoneySpentStats from "./_components/MoneySpentStats";
import TeamCreationStats from "./_components/TeamCreationStats";
import HackathonTeamsList from "./_components/HackathonTeamsList";

export default function Dashboard() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHackathons = async () => {
      try {
        const response = await hackathonService.getAllHackathons();
        setHackathons(response.data || []);
      } catch (error) {
        console.error("Error fetching hackathon data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHackathons();
  }, []);

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
      </div>

      {/* Hackathon Creation Metrics */}
      <div className="col-span-12 xl:col-span-6">
        <HackathonMetrics hackathonsData={hackathons} isLoading={isLoading} />
      </div>

      {/* Account Creation Metrics */}
      <div className="col-span-12 xl:col-span-6">
        <AccountsCreatedChart />
      </div>

      {/* Team Creation Metrics */}
      <div className="col-span-12 xl:col-span-6">
        <TeamCreationStats />
      </div>

      {/* Hackathon Team List */}
      <div className="col-span-12">
        <HackathonTeamsList hackathonsData={hackathons} isLoading={isLoading} />
      </div>

      {/* Sponsorships Stats */}
      <div className="col-span-12">
        <SponsorshipsStats />
      </div>

      {/* Money Spent Stats */}
      <div className="col-span-12">
        <MoneySpentStats />
      </div>
    </div>
  );
}
