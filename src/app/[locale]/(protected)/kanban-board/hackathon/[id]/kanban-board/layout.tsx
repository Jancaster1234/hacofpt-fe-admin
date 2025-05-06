// src/app/[locale]/(protected)/kanban-board/hackathon/[id]/kanban-board/layout.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth_v0";
import { boardUserService } from "@/services/boardUser.service";
import { boardService } from "@/services/board.service";
import { BoardUser } from "@/types/entities/boardUser";
import { Board } from "@/types/entities/board";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";

export default function KanbanBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  const hackathonId = Array.isArray(params.id) ? params.id[0] : params.id;

  // Use useCallback to prevent unnecessary re-renders and to stabilize the function
  const checkUserAccess = useCallback(async () => {
    if (!user || !hackathonId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Step 1: Get the operating board for this hackathon
      const boardResponse =
        await boardService.getOperatingBoardByHackathonId(hackathonId);

      if (!boardResponse.data || !boardResponse.data.id) {
        toast.error(
          boardResponse.message || "No operating board found for this hackathon"
        );
        setHasAccess(false);
        return;
      }

      const boardId = boardResponse.data.id;

      // Step 2: Fetch board users for the retrieved board
      const userResponse =
        await boardUserService.getBoardUsersByBoardId(boardId);

      if (userResponse.data) {
        // Check if current user is in the board users list and not deleted
        const currentUserBoardAccess = userResponse.data.find(
          (boardUser: BoardUser) =>
            boardUser.user?.id === user.id && !boardUser.isDeleted
        );

        if (currentUserBoardAccess) {
          setHasAccess(true);
          // No need for success toast here as this is a background check
        } else {
          // User doesn't have access to this board but we still show the page
          toast.warning("You don't have access to this board");
          setHasAccess(false);
        }
      } else {
        toast.error(
          userResponse.message || "Failed to retrieve board access information"
        );
        setHasAccess(false);
      }
    } catch (error: any) {
      console.error("Error checking board access:", error);
      toast.error(
        error.message || "Error checking board access. Please try again later."
      );
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  }, [hackathonId, user, router]); // toast is intentionally excluded from dependencies

  useEffect(() => {
    checkUserAccess();
  }, [checkUserAccess]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" showText />
      </div>
    );
  }

  // If user doesn't have access, show access denied message instead of children
  return hasAccess ? (
    children
  ) : (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="text-center p-6 max-w-md bg-white rounded-lg border border-red-200 shadow-md">
        <svg
          className="mx-auto mb-4 w-12 h-12 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-4">
          You don't have permission to access this board. Please contact the
          board owner if you believe this is a mistake.
        </p>
        <button
          onClick={() => router.push("/kanban-board")}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
