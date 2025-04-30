// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/_components/TeamParticipantsTab.tsx
"use client";

import { useState, useEffect } from "react";
import { teamService } from "@/services/team.service";
import { Team } from "@/types/entities/team";
import Image from "next/image";

export function TeamParticipantsTab({ hackathonId }: { hackathonId: string }) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setIsLoading(true);
        const response = await teamService.getTeamsByHackathonId(hackathonId);
        setTeams(response.data);
      } catch (err) {
        console.error("Error fetching teams:", err);
        setError("Failed to load teams. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, [hackathonId]);

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading teams...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-4">{error}</div>;
  }

  if (teams.length === 0) {
    return (
      <div className="py-4">
        No teams have registered for this hackathon yet.
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-medium mb-4">
        Registered Teams ({teams.length})
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams.map((team) => (
          <div key={team.id} className="border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold">{team.name}</h4>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {team.teamMembers.length} members
              </span>
            </div>

            {team.bio && <p className="text-gray-600 mb-3">{team.bio}</p>}

            <div className="border-t pt-3">
              <h5 className="font-medium mb-2">Team Members:</h5>
              <ul className="space-y-2">
                {team.teamMembers.map((member) => (
                  <li key={member.id} className="flex items-center gap-3">
                    {member.user.avatarUrl ? (
                      <div className="relative w-8 h-8 rounded-full overflow-hidden">
                        <Image
                          src={member.user.avatarUrl}
                          alt={`${member.user.firstName} ${member.user.lastName}`}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {member.user.firstName.charAt(0)}
                          {member.user.lastName.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="font-medium">
                        {member.user.firstName} {member.user.lastName}
                        {team.teamLeader.id === member.user.id && (
                          <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                            Team Leader
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {member.user.email} • @{member.user.username}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
