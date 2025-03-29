// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/TeamInfo.tsx
import { Team } from "@/types/entities/team";

interface TeamInfoProps {
  team: Team;
}

export function TeamInfo({ team }: TeamInfoProps) {
  return (
    <div className="mt-4 p-3 bg-gray-50 rounded-md">
      <h4 className="font-semibold mb-2">Team Information</h4>
      <p className="text-sm text-gray-700">
        <span className="font-medium">Team Leader:</span>{" "}
        {team.teamLeader.firstName} {team.teamLeader.lastName} (
        {team.teamLeader.email})
      </p>

      {team.teamMembers && team.teamMembers.length > 0 && (
        <div className="mt-2">
          <p className="font-medium text-sm">Team Members:</p>
          <ul className="pl-5 list-disc text-sm text-gray-700">
            {team.teamMembers
              .filter((member) => member.user.id !== team.teamLeader.id)
              .map((member) => (
                <li key={member.id}>
                  {member.user.firstName} {member.user.lastName} (
                  {member.user.email})
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
