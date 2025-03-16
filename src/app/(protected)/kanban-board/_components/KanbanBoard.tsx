// src/app/(protected)/kanban-board/_components/KanbanBoard.tsx
"use client";

import { useKanbanStore } from "@/store/kanbanStore";
import { DndContext, closestCorners } from "@dnd-kit/core";
import KanbanColumn from "./KanbanColumn";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

export default function KanbanBoard() {
  const { columns } = useKanbanStore();
  const [isMentorModalOpen, setMentorModalOpen] = useState(false);
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      avatar:
        "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg",
    },
    {
      id: 2,
      name: "Jane Smith",
      avatar:
        "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg",
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Project Name</h1>
          <p className="text-gray-500">Goal of the board...</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Status Tag (Click to open Mentorship Modal) */}
          <button
            onClick={() => setMentorModalOpen(true)}
            className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm"
          >
            Meeting with mentor
          </button>

          {/* Avatars */}
          <div className="flex -space-x-2">
            {users.slice(0, 3).map((user) => (
              <img
                key={user.id}
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full border-2 border-white"
              />
            ))}
            {users.length > 3 && (
              <span className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full border-2 border-white text-sm">
                +{users.length - 3}
              </span>
            )}
          </div>

          {/* Invite Button */}
          <button
            onClick={() => setInviteModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium"
          >
            Invite
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <DndContext collisionDetection={closestCorners}>
        <div className="grid grid-cols-3 gap-6">
          {columns.map((column) => (
            <KanbanColumn key={column.id} column={column} />
          ))}
        </div>
      </DndContext>

      {/* Mentorship Session Modal */}
      <Transition appear show={isMentorModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setMentorModalOpen(false)}
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl w-96">
              <Dialog.Title className="text-lg font-semibold">
                Request Mentorship Session
              </Dialog.Title>
              <form className="space-y-4 mt-3">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  type="datetime-local"
                  placeholder="Start Time"
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  type="datetime-local"
                  placeholder="End Time"
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full px-3 py-2 border rounded"
                />
                <textarea
                  placeholder="Description"
                  className="w-full px-3 py-2 border rounded h-24"
                ></textarea>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setMentorModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>

      {/* Invite Users Modal */}
      <Transition appear show={isInviteModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setInviteModalOpen(false)}
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl w-96">
              <Dialog.Title className="text-lg font-semibold">
                Manage Users
              </Dialog.Title>
              <div className="mt-3 space-y-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <span>{user.name}</span>
                    </div>
                    <button
                      onClick={() =>
                        setUsers(users.filter((u) => u.id !== user.id))
                      }
                      className="px-2 py-1 text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  placeholder="Enter name..."
                  className="w-full px-3 py-2 border rounded"
                />
                <button className="w-full px-4 py-2 bg-green-500 text-white rounded">
                  Add User
                </button>
                <div className="flex justify-end mt-3">
                  <button
                    type="button"
                    onClick={() => setInviteModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
