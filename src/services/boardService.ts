// src/services/boardService.ts
import { Board } from "@/types/entities/board";
import { BoardList } from "@/types/entities/boardList";
import { BoardLabel } from "@/types/entities/boardLabel";
import { Task } from "@/types/entities/task";
import { taskService } from "@/services/task.service";
import { boardService as realBoardService } from "@/services/board.service";
import { boardListService } from "@/services/boardList.service";
import { boardLabelService } from "@/services/boardLabel.service";

type CreateTaskParams = {
  title: string;
  description?: string;
  boardListId: string;
  position: number;
  dueDate?: string;
};

export async function createTask(params: CreateTaskParams): Promise<Task> {
  try {
    const response = await taskService.createTask({
      title: params.title,
      description: params.description || "",
      position: params.position,
      boardListId: params.boardListId,
      dueDate: params.dueDate || "",
    });

    if (!response || !response.data) {
      throw new Error("Failed to create task");
    }

    return response.data;
  } catch (error) {
    console.error("API error creating task:", error);
    throw error;
  }
}

// Board API functions
export const updateBoard = async (
  boardId: string,
  data: {
    name: string;
    description: string;
    teamId?: string;
    hackathonId?: string;
    ownerId?: string;
  }
): Promise<Board> => {
  try {
    const response = await realBoardService.updateBoard(boardId, {
      name: data.name,
      description: data.description,
      teamId: data.teamId,
      hackathonId: data.hackathonId,
      ownerId: data.ownerId,
    });

    if (!response || !response.data) {
      throw new Error("Failed to update board");
    }

    return response.data;
  } catch (error) {
    console.error("API error updating board:", error);
    throw error;
  }
};

// BoardList API functions
export const createBoardList = async (data: {
  name: string;
  boardId: string;
  position?: number;
}): Promise<BoardList> => {
  try {
    const response = await boardListService.createBoardList({
      name: data.name,
      position: data.position !== undefined ? data.position : 999,
      boardId: data.boardId,
    });

    if (!response || !response.data) {
      throw new Error("Failed to create board list");
    }

    return response.data;
  } catch (error) {
    console.error("API error creating board list:", error);
    throw error;
  }
};

export const updateBoardList = async (
  boardListId: string,
  data: { name: string; position?: number; boardId: string }
): Promise<BoardList> => {
  try {
    const response = await boardListService.updateBoardList(boardListId, {
      name: data.name,
      position: data.position || 0,
      boardId: data.boardId,
    });

    if (!response || !response.data) {
      throw new Error("Failed to update board list");
    }

    return response.data;
  } catch (error) {
    console.error("API error updating board list:", error);
    throw error;
  }
};

export const deleteBoardList = async (
  boardListId: string
): Promise<boolean> => {
  try {
    await boardListService.deleteBoardList(boardListId);
    return true;
  } catch (error) {
    console.error("API error deleting board list:", error);
    return false;
  }
};

// Bulk update position for drag and drop
export const updateBoardListPositions = async (
  updates: { id: string; position: number }[]
): Promise<boolean> => {
  try {
    await boardListService.bulkUpdateBoardListPositions(updates);
    return true;
  } catch (error) {
    console.error("API error bulk updating board list positions:", error);
    return false;
  }
};

// BoardLabel API functions
export const createBoardLabel = async (data: {
  name: string;
  color: string;
  boardId: string;
}): Promise<{ data: BoardLabel; message?: string }> => {
  try {
    const response = await boardLabelService.createBoardLabel({
      name: data.name,
      color: data.color,
      boardId: data.boardId,
    });

    if (!response || !response.data) {
      throw new Error(response?.message || "Failed to create board label");
    }

    return {
      data: response.data,
      message: response.message || "Board label created successfully",
    };
  } catch (error: any) {
    console.error("API error creating board label:", error);
    // Pass through the error with its message
    if (error.message) {
      throw new Error(error.message);
    } else if (typeof error === "object" && error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export const updateBoardLabel = async (
  boardLabelId: string,
  data: { name: string; color: string; boardId: string }
): Promise<{ data: BoardLabel; message?: string }> => {
  try {
    const response = await boardLabelService.updateBoardLabel(boardLabelId, {
      name: data.name,
      color: data.color,
      boardId: data.boardId,
    });

    if (!response || !response.data) {
      throw new Error(response?.message || "Failed to update board label");
    }

    return {
      data: response.data,
      message: response.message || "Board label updated successfully",
    };
  } catch (error: any) {
    console.error("API error updating board label:", error);
    // Pass through the error with its message
    if (error.message) {
      throw new Error(error.message);
    } else if (typeof error === "object" && error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export const deleteBoardLabel = async (
  boardLabelId: string
): Promise<boolean> => {
  try {
    await boardLabelService.deleteBoardLabel(boardLabelId);
    return true;
  } catch (error) {
    console.error("API error deleting board label:", error);
    return false;
  }
};

export const updateTaskPositions = async (
  updates: { id: string; boardListId: string; position: number }[]
): Promise<boolean> => {
  try {
    const response = await taskService.bulkUpdateTaskPositions(updates);

    if (!response || !response.data) {
      throw new Error("Failed to update task positions");
    }

    return true;
  } catch (error) {
    console.error("API error updating task positions:", error);
    return false;
  }
};
