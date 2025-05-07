// src/components/header/NotificationDetailModal.tsx
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Image from "next/image";
import { format } from "date-fns";

interface NotificationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: {
    id: string;
    content: string;
    metadata: string;
    createdAt: string;
    sender: {
      id: string;
      name: string;
      avatarUrl: string;
    };
    isRead: boolean;
  } | null;
}

export default function NotificationDetailModal({
  isOpen,
  onClose,
  notification,
}: NotificationDetailModalProps) {
  if (!notification) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              //   enterFrom="opacity-0 scale-95"
              //   enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              //   leaveFrom="opacity-100 scale-100"
              //   leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white/80 p-6 text-left align-middle shadow-xl transition-all border border-gray-200">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  Notification Details
                </Dialog.Title>

                <div className="mt-2 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <Image
                        src={
                          notification.sender.avatarUrl ||
                          "https://randomuser.me/api/portraits/men/99.jpg"
                        }
                        alt={`${notification.sender.name}'s avatar`}
                        width={48}
                        height={48}
                        className="rounded-full object-cover ring-2 ring-white"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {notification.sender.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(notification.createdAt), "PPpp")}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">
                      {notification.content}
                    </p>
                  </div>

                  {notification.metadata && notification.metadata !== "{}" && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-900 mb-2">
                        Additional Information
                      </p>
                      <pre className="text-xs bg-white/50 p-3 rounded-lg overflow-auto border border-gray-100">
                        {JSON.stringify(
                          JSON.parse(notification.metadata),
                          null,
                          2
                        )}
                      </pre>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
