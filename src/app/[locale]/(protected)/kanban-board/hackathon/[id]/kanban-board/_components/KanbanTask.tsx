// src/app/[locale]/hackathon/[id]/team/[teamId]/board/_components/KanbanTask.tsx
import { useState, useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format, isPast, parseISO } from "date-fns";
import Image from "next/image";
import { useTheme } from "next-themes";
import TaskEditModal from "./TaskEdit/TaskEditModal";
import { Task } from "@/types/entities/task";
import { useKanbanStore } from "@/store/kanbanStore";
import { useTranslations } from "@/hooks/useTranslations";

interface KanbanTaskProps {
  task: Task;
}

export default function KanbanTask({ task }: KanbanTaskProps) {
  const t = useTranslations("kanban");
  const { resolvedTheme } = useTheme();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const isDragging = useRef(false);
  const clickStartPosition = useRef({ x: 0, y: 0 });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isDraggingNow,
  } = useSortable({
    id: `task-${task.id}`,
    data: {
      type: "task",
      task,
    },
  });

  // Apply CSS transform from dnd-kit
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDraggingNow ? 0.5 : 1,
  };

  // Format date and time
  const formatDueDate = () => {
    if (!task.dueDate) return null;

    const date = parseISO(task.dueDate);
    const formattedDate = format(date, "MMM d");
    const formattedTime = format(date, "h:mm a");
    return { formattedDate, formattedTime, isPastDue: isPast(date) };
  };

  const dueDate = formatDueDate();

  const board = useKanbanStore((state) => state.board);

  // Get board labels for the TaskEditModal
  const boardLabels = board?.boardLabels || [];

  // Handle mouse down to track if it's a potential drag
  const handleMouseDown = (e: React.MouseEvent) => {
    clickStartPosition.current = { x: e.clientX, y: e.clientY };
    isDragging.current = false;
  };

  // Handle mouse move to detect dragging
  const handleMouseMove = () => {
    isDragging.current = true;
  };

  // Handle mouse up to determine if it was a click or drag
  const handleMouseUp = (e: React.MouseEvent) => {
    const deltaX = Math.abs(e.clientX - clickStartPosition.current.x);
    const deltaY = Math.abs(e.clientY - clickStartPosition.current.y);

    // If the mouse barely moved, consider it a click and not a drag
    if (!isDragging.current && deltaX < 5 && deltaY < 5) {
      setIsEditModalOpen(true);
    }
  };

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      clickStartPosition.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
      isDragging.current = false;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging.current) {
      setIsEditModalOpen(true);
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className="bg-white dark:bg-gray-700 p-3 sm:p-4 rounded-lg shadow-md cursor-pointer space-y-1 sm:space-y-2 transition-colors duration-300"
        style={style}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Task Title */}
        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">
          {task.title}
        </p>

        {/* Task Description (if available) */}
        {task.description && (
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Task Labels */}
        {task.taskLabels && task.taskLabels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.taskLabels.map(
              (taskLabel) =>
                taskLabel.boardLabel && (
                  <span
                    key={taskLabel.id}
                    className="inline-block w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                    style={{ backgroundColor: taskLabel.boardLabel.color }}
                    title={taskLabel.boardLabel.name}
                  />
                )
            )}
          </div>
        )}

        {/* Task Meta */}
        <div className="flex flex-wrap gap-2 sm:gap-3 items-center text-xs sm:text-sm text-gray-400 dark:text-gray-400">
          {/* Due Date with improved display */}
          {dueDate && (
            <div
              className={`flex items-center gap-1 ${
                dueDate.isPastDue ? "text-red-500 dark:text-red-400" : ""
              }`}
              title={dueDate.isPastDue ? t("pastDue") : t("dueDate")}
            >
              <span role="img" aria-label={t("calendar")}>
                🗓️
              </span>
              <span>{dueDate.formattedDate}</span>
              <span className="text-xs hidden sm:inline">
                {t("atTime", { time: dueDate.formattedTime })}
              </span>
            </div>
          )}

          {/* Show attachments count if any */}
          {task.fileUrls && task.fileUrls.length > 0 && (
            <span className="flex items-center gap-1" title={t("attachments")}>
              <span role="img" aria-label={t("paperclip")}>
                📎
              </span>
              <span>{task.fileUrls.length}</span>
            </span>
          )}

          {/* Show comments count if any */}
          {task.comments && task.comments.length > 0 && (
            <span className="flex items-center gap-1" title={t("comments")}>
              <span role="img" aria-label={t("speechBubble")}>
                💬
              </span>
              <span>{task.comments.length}</span>
            </span>
          )}
        </div>

        {/* Task Assignees using next/image */}
        {task.assignees && task.assignees.length > 0 && (
          <div className="flex -space-x-1 sm:-space-x-2 mt-1">
            {task.assignees.slice(0, 3).map(
              (assignee) =>
                assignee.user && (
                  <div
                    key={assignee.id}
                    className="relative w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white dark:border-gray-700 overflow-hidden"
                    title={`${assignee.user.firstName} ${assignee.user.lastName}`}
                  >
                    <Image
                      src={
                        assignee.user.avatarUrl ||
                        "https://via.placeholder.com/30"
                      }
                      alt={`${assignee.user.firstName} ${assignee.user.lastName}`}
                      fill
                      sizes="(max-width: 640px) 20px, 24px"
                      className="object-cover"
                    />
                  </div>
                )
            )}
            {task.assignees.length > 3 && (
              <span className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded-full border-2 border-white dark:border-gray-700 text-xs text-gray-800 dark:text-gray-200">
                +{task.assignees.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Task Edit Modal */}
      {isEditModalOpen && (
        <TaskEditModal
          task={task}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          boardLabels={boardLabels}
        />
      )}
    </>
  );
}
