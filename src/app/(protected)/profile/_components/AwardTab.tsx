// src/app/profile/_components/AwardTab.tsx
import Image from "next/image";
import { User } from "@/types/entities/user";

interface AwardTabProps {
  user: User;
}

const AwardTab: React.FC<AwardTabProps> = ({ user }) => {
  const userTeamIds = user.userTeams.map((ut) => ut.teamId);

  const placementCounts: { [placement: number]: number } = {};

  user.userHackathons.forEach((userHackathon) => {
    const hackathonResults = userHackathon.hackathon.hackathonResults ?? [];
    hackathonResults.forEach((result) => {
      if (userTeamIds.includes(result.teamId)) {
        placementCounts[result.placement] =
          (placementCounts[result.placement] || 0) + 1;
      }
    });
  });

  const placements = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mt-6">
      {placements.map((placement) => (
        <div key={placement} className="flex flex-col items-center">
          <Image
            src={`/awards/${placement}.png`}
            alt={`Placement ${placement}`}
            title={`Placement ${placement}`}
            width={80}
            height={80}
          />
          <span className="text-xl mt-2 font-semibold">
            {placementCounts[placement] || 0}
          </span>
        </div>
      ))}
    </div>
  );
};

export default AwardTab;
