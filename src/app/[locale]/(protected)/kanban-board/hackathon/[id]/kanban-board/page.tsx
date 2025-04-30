// src/app/[locale]/(protected)/kanban-board/hackathon/[id]/kanban-board/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import KanbanBoard from "./_components/KanbanBoard";
import { Board } from "@/types/entities/board";
import { UserHackathon } from "@/types/entities/userHackathon";
import ApiResponseModal from "@/components/common/ApiResponseModal";
import { useApiModal } from "@/hooks/useApiModal";
import { boardService } from "@/services/board.service";
import { userHackathonService } from "@/services/userHackathon.service";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function HackathonBoardPage() {
  const toast = useToast();
  const id = useParams();
  const hackathonId = Array.isArray(id) ? id[0] : id;

  const [board, setBoard] = useState<Board | null>(null);
  const [userHackathons, setUserHackathons] = useState<UserHackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [boardLoading, setBoardLoading] = useState(true);

  // Use the API modal hook
  const { modalState, hideModal } = useApiModal();

  // Memoize the fetchInitialData function
  const fetchInitialData = useCallback(async () => {
    if (!hackathonId) return;

    setLoading(true);

    try {
      // Fetch operating board data
      const boardResponse =
        await boardService.getOperatingBoardByHackathonId(hackathonId);
      if (boardResponse.data) {
        setBoard(boardResponse.data);
      } else if (boardResponse.message) {
        // Only show error toast if there's a message
        toast.error(boardResponse.message);
      }

      // Fetch user hackathons data
      const userHackathonsResponse =
        await userHackathonService.getUserHackathonsByHackathonId(hackathonId);
      if (userHackathonsResponse.data) {
        setUserHackathons(userHackathonsResponse.data);
      } else if (userHackathonsResponse.message) {
        // Only show error toast if there's a message
        toast.error(userHackathonsResponse.message);
      }

      setBoardLoading(false);
    } catch (error) {
      console.error("Error fetching initial data:", error);
      // Handle error outside of dependency array
      if (error instanceof Error && error.message) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [hackathonId]); // Remove toast from dependencies

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900 p-4 md:p-8 transition-colors duration-300">
      <div className="w-full max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" showText />
          </div>
        ) : (
          <KanbanBoard
            board={board}
            userHackathons={userHackathons}
            isLoading={boardLoading}
          />
        )}
      </div>

      {/* API Response Modal */}
      <ApiResponseModal
        isOpen={modalState.isOpen}
        onClose={hideModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
      />
    </div>
  );
}
