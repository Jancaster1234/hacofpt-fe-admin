// src/services/boardService.ts
import { Board } from "@/types/entities/board";
import { BoardList } from "@/types/entities/boardList";
import { BoardLabel } from "@/types/entities/boardLabel";

// Board API functions
export const updateBoard = async (
  boardId: string,
  data: { name: string; description: string }
): Promise<Board> => {
  // Simulate API call
  console.log("API call: Updating board", { boardId, ...data });

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: boardId,
        name: data.name,
        description: data.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Board);
    }, 500);
  });
};

// BoardList API functions
export const createBoardList = async (data: {
  name: string;
  boardId: string;
}): Promise<BoardList> => {
  // Simulate API call
  console.log("API call: Creating board list", data);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `list-${Date.now()}`,
        name: data.name,
        position: 999, // This will be set by the backend
        boardId: data.boardId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdByUserName: "currentUser", // This should be the actual user
      } as BoardList);
    }, 500);
  });
};

export const updateBoardList = async (
  boardListId: string,
  data: { name: string; position?: number; boardId: string }
): Promise<BoardList> => {
  // Simulate API call
  console.log("API call: Updating board list", { boardListId, ...data });

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: boardListId,
        name: data.name,
        position: data.position || 0,
        boardId: data.boardId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as BoardList);
    }, 500);
  });
};

export const deleteBoardList = async (
  boardListId: string
): Promise<boolean> => {
  // Simulate API call
  console.log("API call: Deleting board list", { boardListId });

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};

// Bulk update position for drag and drop
export const updateBoardListPositions = async (
  updates: { id: string; position: number }[]
): Promise<boolean> => {
  // Simulate API call
  console.log("API call: Bulk updating board list positions", { updates });

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};

// BoardLabel API functions
export const createBoardLabel = async (data: {
  name: string;
  color: string;
  boardId: string;
}): Promise<BoardLabel> => {
  // Simulate API call
  console.log("API call: Creating board label", data);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `label-${Date.now()}`,
        name: data.name,
        color: data.color,
        boardId: data.boardId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as BoardLabel);
    }, 500);
  });
};

export const updateBoardLabel = async (
  boardLabelId: string,
  data: { name: string; color: string; boardId: string }
): Promise<BoardLabel> => {
  // Simulate API call
  console.log("API call: Updating board label", { boardLabelId, ...data });

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: boardLabelId,
        name: data.name,
        color: data.color,
        boardId: data.boardId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as BoardLabel);
    }, 500);
  });
};

export const deleteBoardLabel = async (
  boardLabelId: string
): Promise<boolean> => {
  // Simulate API call
  console.log("API call: Deleting board label", { boardLabelId });

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};
