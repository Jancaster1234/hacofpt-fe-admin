// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/TeamMembersTooltip.tsx
import { useState, useEffect } from "react";
import { UsersIcon } from "lucide-react";

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

// Mock function to fetch team members
const fetchTeamMembers = async (teamId: string): Promise<TeamMember[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          role: "Developer",
        },
        {
          id: "2",
          firstName: "Jane",
          lastName: "Smith",
          email: "jane.smith@example.com",
          role: "Designer",
        },
        {
          id: "3",
          firstName: "Alex",
          lastName: "Johnson",
          email: "alex.johnson@example.com",
          role: "Developer",
        },
      ]);
    }, 300);
  });
};

export function TeamMembersTooltip({ teamId }: TeamMembersTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isVisible && members.length === 0) {
      setLoading(true);
      fetchTeamMembers(teamId)
        .then((data) => {
          setMembers(data);
        })
        .catch((error) => {
          console.error("Error fetching team members:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isVisible, teamId, members.length]);

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
