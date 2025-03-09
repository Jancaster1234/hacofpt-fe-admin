// src/app/hackathon/[id]/board/_components/SubmissionTab.tsx
"use client";

import { useState, useEffect } from "react";

// Mock API function (replace with real API call)
const fetchSubmissionForRound = async (round: string) => {
  // Mock submission data per round
  const mockSubmissions = {
    "Round 1": {
      submitted: true,
      submitter: "phucbptss171315@fpt.edu.vn",
      files: [{ name: "Round1_Submission.zip", link: "#" }],
      deadline: "2024-04-26T17:00:00",
    },
    "Round 2": {
      submitted: true,
      submitter: "john.doe@example.com",
      files: [{ name: "Round2_Submission.pdf", link: "#" }],
      deadline: "2024-04-27T17:00:00",
    },
    "Round 3": {
      submitted: false,
      submitter: "",
      files: [],
      deadline: "2024-04-28T17:00:00",
    },
  };
  return mockSubmissions[round] || null;
};

export default function SubmissionTab({ round }: { round: string }) {
  const [submission, setSubmission] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const loadSubmission = async () => {
      const data = await fetchSubmissionForRound(round);
      setSubmission(data);
    };

    loadSubmission();
  }, [round]);

  useEffect(() => {
    if (!submission) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const deadline = new Date(submission.deadline).getTime();
      const distance = deadline - now;

      if (distance < 0) {
        setTimeLeft("Deadline Passed");
        clearInterval(interval);
        return;
      }

      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [submission]);

  if (!submission) return <p>Loading submission...</p>;

  return (
    <div>
      {submission.submitted ? (
        <>
          <h2 className="text-lg font-semibold">
            Your team has submitted successfully
          </h2>
          <p className="mt-2 font-semibold">
            Your submission:{" "}
            <span className="font-bold">{submission.submitter}</span>
          </p>

          {/* Submission Files */}
          <div className="mt-3">
            {submission.files.map((file: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-100 p-2 rounded-md mb-2"
              >
                <p className="truncate">{file.name}</p>
                <a href={file.link} className="text-blue-500">
                  Download
                </a>
              </div>
            ))}
          </div>

          {/* Timer & Resubmit */}
          <p className="mt-4 text-red-600 font-bold text-lg">
            Time left: {timeLeft}
          </p>
          <p className="text-lg font-bold">
            Submit due date: {submission.deadline}
          </p>

          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
            Resubmit
          </button>
        </>
      ) : (
        <p className="text-red-500">No submission yet for this round.</p>
      )}
    </div>
  );
}
