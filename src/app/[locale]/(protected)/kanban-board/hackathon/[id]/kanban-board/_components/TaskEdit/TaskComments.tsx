// src/app/[locale]/hackathon/[id]/team/[teamId]/board/_components/TaskEdit/TaskComments.tsx
"use client";

import { useState } from "react";
import { TaskComment } from "@/types/entities/taskComment";
import { formatDistance } from "date-fns";
import { taskCommentService } from "@/services/taskComment.service";
import { useAuth } from "@/hooks/useAuth_v0";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface TaskCommentsProps {
  comments: TaskComment[];
  taskId: string;
  onAddComment?: (comment: TaskComment) => void;
  onDeleteComment?: (commentId: string) => void;
  onError?: (error: string) => void;
}

export default function TaskComments({
  comments,
  taskId,
  onAddComment,
  onDeleteComment,
  onError,
}: TaskCommentsProps) {
  const { user } = useAuth();
  const t = useTranslations("taskComments");
  const toast = useToast();

  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);

      const { data: createdComment, message } =
        await taskCommentService.createTaskComment({
          taskId,
          content: newComment.trim(),
        });

      if (createdComment && onAddComment) {
        onAddComment(createdComment);
        toast.success(t("commentAdded"));
      }

      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      toast.error(errorMsg || t("failedToAddComment"));
      if (onError) onError(t("failedToAddComment"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (comment: TaskComment) => {
    setEditingCommentId(comment.id);
    setEditCommentContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditCommentContent("");
  };

  const handleSaveEdit = async (commentId: string) => {
    if (!editCommentContent.trim() || isEditing) return;

    try {
      setIsEditing(true);

      const { data: updatedComment, message } =
        await taskCommentService.updateTaskComment(commentId, {
          taskId,
          content: editCommentContent.trim(),
        });

      if (updatedComment) {
        // Update the parent component with the edited comment
        if (onAddComment && updatedComment) {
          onAddComment(updatedComment);
          toast.success(t("commentUpdated"));
        }
      }

      setEditingCommentId(null);
      setEditCommentContent("");
    } catch (error) {
      console.error("Error updating comment:", error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      toast.error(errorMsg || t("failedToUpdateComment"));
      if (onError) onError(t("failedToUpdateComment"));
    } finally {
      setIsEditing(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm(t("deleteCommentConfirmation")) || isDeleting) {
      return;
    }

    try {
      setIsDeleting(true);

      const { message } = await taskCommentService.deleteTaskComment(commentId);

      // Use the dedicated onDeleteComment function if available
      if (onDeleteComment) {
        onDeleteComment(commentId);
        toast.success(t("commentDeleted"));
      } else if (onAddComment) {
        // Fallback to the previous workaround if onDeleteComment isn't provided
        const deletedComment = comments.find((c) => c.id === commentId);
        if (deletedComment) {
          onAddComment({
            ...deletedComment,
            _isDeleted: true, // Special flag to signal deletion
          } as any);
          toast.success(t("commentDeleted"));
        }
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      toast.error(errorMsg || t("failedToDeleteComment"));
      if (onError) onError(t("failedToDeleteComment"));
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper function to check if current user is the comment creator by username
  const isCommentOwner = (comment: TaskComment): boolean => {
    // Compare the current user's username with the comment creator's username
    return user?.username === comment.createdByUserName;
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 rounded-md transition-colors duration-200">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 flex items-center">
        <span className="mr-2">💬</span>
        {t("comments")}
      </h3>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={t("writeComment")}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md min-h-[80px] text-sm 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
          disabled={isSubmitting}
          aria-label={t("commentTextarea")}
        />
        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            disabled={!newComment.trim() || isSubmitting}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 
                     disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed 
                     text-sm transition-colors duration-200 flex items-center gap-2"
            aria-label={isSubmitting ? t("addingComment") : t("addComment")}
          >
            {isSubmitting && <LoadingSpinner size="sm" />}
            {isSubmitting ? t("addingComment") : t("addComment")}
          </button>
        </div>
      </form>

      {/* Comment list */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm 
                     border border-gray-100 dark:border-gray-600 transition-colors duration-200"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-gray-300 dark:bg-gray-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {comment.createdByUserName || t("user")}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                  {formatDistance(
                    new Date(comment.createdAt || ""),
                    new Date(),
                    {
                      addSuffix: true,
                    }
                  )}
                </span>

                {/* Edit/Delete options for comment owner */}
                {isCommentOwner(comment) && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(comment)}
                      className="text-xs text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                      disabled={isEditing || isDeleting}
                      aria-label={t("edit")}
                    >
                      {t("edit")}
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-xs text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200"
                      disabled={isEditing || isDeleting}
                      aria-label={t("delete")}
                    >
                      {isDeleting ? <LoadingSpinner size="sm" /> : t("delete")}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {editingCommentId === comment.id ? (
              <div>
                <textarea
                  value={editCommentContent}
                  onChange={(e) => setEditCommentContent(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md min-h-[60px] 
                           text-sm mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  disabled={isEditing}
                  aria-label={t("editCommentTextarea")}
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={handleCancelEdit}
                    className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 
                             rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200
                             text-gray-700 dark:text-gray-200"
                    disabled={isEditing}
                    aria-label={t("cancel")}
                  >
                    {t("cancel")}
                  </button>
                  <button
                    onClick={() => handleSaveEdit(comment.id)}
                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded 
                             hover:bg-blue-600 disabled:bg-blue-300 dark:disabled:bg-blue-700 
                             transition-colors duration-200 flex items-center gap-1"
                    disabled={!editCommentContent.trim() || isEditing}
                    aria-label={isEditing ? t("saving") : t("save")}
                  >
                    {isEditing && <LoadingSpinner size="sm" />}
                    {isEditing ? t("saving") : t("save")}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                {comment.content}
              </p>
            )}
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-4">
            {t("noComments")}
          </p>
        )}
      </div>
    </div>
  );
}
