// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/UserManagement.tsx
import { useEffect, useState } from "react";
import { fetchMockUserHackathons } from "../_mocks/fetchMockUserHackathons";
import { UserHackathon } from "@/types/entities/userHackathon";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import Image from "next/image";

export default function UserManagement({
  hackathonId,
}: {
  hackathonId: string;
}) {
  const [users, setUsers] = useState<UserHackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRoles, setExpandedRoles] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    fetchMockUserHackathons(hackathonId).then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, [hackathonId]);

  const groupedUsers = {
    ORGANIZER: users.filter((u) => u.role === "ORGANIZER"),
    JUDGE: users.filter((u) => u.role === "JUDGE"),
    MENTOR: users.filter((u) => u.role === "MENTOR"),
  };

  const toggleRoleVisibility = (role: string) => {
    setExpandedRoles((prev) => ({ ...prev, [role]: !prev[role] }));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        User Management
      </h2>
      {loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : (
        Object.entries(groupedUsers).map(([role, usersInRole]) => (
          <div key={role} className="mb-6">
            <div
              className="flex justify-between items-center cursor-pointer p-2 bg-gray-200 rounded-md"
              onClick={() => toggleRoleVisibility(role)}
            >
              <h3 className="text-lg font-medium text-gray-800 capitalize">
                {role.toLowerCase()}
              </h3>
              {expandedRoles[role] ? (
                <ChevronUpIcon className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 text-gray-600" />
              )}
            </div>
            {expandedRoles[role] &&
              (usersInRole.length > 0 ? (
                <div className="grid grid-cols-1 md/grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                  {usersInRole.map(({ id, user }) => (
                    <div
                      key={id}
                      className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4"
                    >
                      <Image
                        src={user.avatarUrl}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-12 h-12 rounded-full"
                        width={48}
                        height={48}
                      />
                      <div>
                        <p className="text-gray-800 font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-gray-600 text-sm">{user.email}</p>
                        <p className="text-gray-500 text-xs">
                          {user.experienceLevel} - {user.skills.join(", ")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 mt-2">
                  No {role.toLowerCase()}s found.
                </p>
              ))}
          </div>
        ))
      )}
    </div>
  );
}
