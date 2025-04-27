// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/TeamMembersTooltip.tsx
import { useState, useEffect } from "react";
import { UsersIcon } from "lucide-react";
import { useApiModal } from "@/hooks/useApiModal";

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface TeamMembersTooltipProps {
  teamId: string;
}

// Create a team member service
// src/services/teamMember.service.ts
import { apiService } from "@/services/apiService_v0";
import { handleApiError } from "@/utils/errorHandler";

export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

class TeamMemberService {
  async getTeamMembers(
    teamId: string
  ): Promise<{ data: TeamMember[]; message?: string }> {
    try {
      const response = await apiService.auth.get<TeamMember[]>(
        `/hackathon-service/api/v1/team-members?teamId=${teamId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve team members");
      }

      return {
        data: response.data,
        message: response.message || "Team members retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<TeamMember[]>(
        error,
        [],
        "[TeamMember Service] Error fetching team members:"
      );
    }
  }
}

export const teamMemberService = new TeamMemberService();

// Now update the TeamMembersTooltip component
export function TeamMembersTooltip({ teamId }: TeamMembersTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const { showError } = useApiModal();

  useEffect(() => {
    if (isVisible && members.length === 0) {
      setLoading(true);
      teamMemberService
        .getTeamMembers(teamId)
        .then((response) => {
          setMembers(response.data);
        })
        .catch((error) => {
          console.error("Error fetching team members:", error);
          showError("Error", "Failed to load team members.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isVisible, teamId, members.length, showError]);

  return (
    <div className="relative inline-block ml-2">
      <UsersIcon
        size={16}
        className="text-gray-400 cursor-pointer"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
      />
      {isVisible && (
        <div className="absolute z-10 w-72 p-3 text-sm bg-white border rounded-md shadow-md -left-2 -top-2 transform -translate-y-full">
          <div className="font-semibold text-gray-800 mb-2">Team Members</div>
          {loading ? (
            <div className="text-gray-600">Loading...</div>
          ) : (
            <div className="space-y-2">
              {members.map((member) => (
                <div key={member.id} className="flex flex-col">
                  <div className="font-medium">
                    {member.firstName} {member.lastName}
                  </div>
                  <div className="text-xs text-gray-500">{member.email}</div>
                  <div className="text-xs text-gray-400">{member.role}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
