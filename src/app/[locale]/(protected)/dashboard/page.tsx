// src/app/[locale]/(protected)/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Hackathon } from "@/types/entities/hackathon";
import { Sponsorship } from "@/types/entities/sponsorship"; // Import Sponsorship type
import { hackathonService } from "@/services/hackathon.service";
import { sponsorshipService } from "@/services/sponsorship.service"; // Import sponsorshipService
import HackathonMetrics from "./_components/HackathonMetrics";
import AccountsCreatedChart from "./_components/AccountsCreatedChart";
import SponsorshipsStats from "./_components/SponsorshipsStats";
import MoneySpentStats from "./_components/MoneySpentStats";
import TeamCreationStats from "./_components/TeamCreationStats";
import HackathonTeamsList from "./_components/HackathonTeamsList";

export default function Dashboard() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [isHackathonsLoading, setIsHackathonsLoading] = useState(true);
  const [isSponsorshipsLoading, setIsSponsorshipsLoading] = useState(true);

  useEffect(() => {
    const loadHackathons = async () => {
      try {
        const response = await hackathonService.getAllHackathons();
        setHackathons(response.data || []);
      } catch (error) {
        console.error("Error fetching hackathon data:", error);
      } finally {
        setIsHackathonsLoading(false);
      }
    };

    const loadSponsorships = async () => {
      try {
        const response = await sponsorshipService.getAllSponsorships();
        setSponsorships(response.data || []);
      } catch (error) {
        console.error("Error fetching sponsorship data:", error);
      } finally {
        setIsSponsorshipsLoading(false);
      }
    };

    loadHackathons();
    loadSponsorships();
  }, []);

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
      </div>

      {/* Hackathon Creation Metrics */}
      <div className="col-span-12 xl:col-span-6">
        <HackathonMetrics
          hackathonsData={hackathons}
          isLoading={isHackathonsLoading}
        />
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
        <HackathonTeamsList
          hackathonsData={hackathons}
          isLoading={isHackathonsLoading}
        />
      </div>

      {/* Sponsorships Stats */}
      <div className="col-span-12">
        <SponsorshipsStats
          sponsorshipsData={sponsorships}
          isLoading={isSponsorshipsLoading}
        />
      </div>

      {/* Money Spent Stats */}
      <div className="col-span-12">
        <MoneySpentStats
          sponsorshipsData={sponsorships}
          isLoading={isSponsorshipsLoading}
        />
      </div>
    </div>
  );
}
