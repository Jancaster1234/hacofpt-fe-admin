// src/app/(protected)/organizer-hackathon-management/[id]/_components/ResourceManagementButton.tsx
"use client"; // Ensures this runs on the client side

import { useRouter } from "next/navigation";

export default function ResourceManagementButton({
  hackathonId,
}: {
  hackathonId: string;
}) {
  const router = useRouter();

  const navigateToResourceManagement = () => {
    router.push(
      `/organizer-hackathon-management/${hackathonId}/resource-management`
    );
  };

  return (
    <button
      onClick={navigateToResourceManagement}
      className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
    >
      Resource Management
    </button>
  );
}
