// src/app/[locale]/(protected)/dashboard/page.tsx
import type { Metadata } from "next";
import React from "react";
import HackathonMetrics from "./_components/HackathonMetrics";
import AccountsCreatedChart from "./_components/AccountsCreatedChart";
import SponsorshipsStats from "./_components/SponsorshipsStats";
import MoneySpentStats from "./_components/MoneySpentStats";

export const metadata: Metadata = {
  title: "Hackathon Platform Dashboard",
  description: "Dashboard for the FPT University Hackathon Platform",
};

export default function Dashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
      </div>

      {/* Hackathon Creation Metrics */}
      <div className="col-span-12 xl:col-span-6">
        <HackathonMetrics />
      </div>

      {/* Account Creation Metrics */}
      <div className="col-span-12 xl:col-span-6">
        <AccountsCreatedChart />
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
