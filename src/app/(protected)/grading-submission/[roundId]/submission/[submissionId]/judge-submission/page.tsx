// src/app/(protected)/grading-submission/[id]/[roundId]/submission/[submissionId]/judge-submission/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchMockSubmissions } from "../../../../[id]/_mocks/fetchMockSubmissions";
import { Submission } from "@/types/entities/submission";
import { useAuth } from "@/hooks/useAuth_v0";

export default function JudgeSubmissionPage() {
  const { id, submissionId } = useParams();
  const { user } = useAuth();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [judgeSubmissions, setJudgeSubmissions] = useState<any[]>([]);
  const [criteriaScores, setCriteriaScores] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    const fetchSubmission = async () => {
      if (!user) return;

      try {
        // Fetch submission by ID
        const submissions = await fetchMockSubmissions(user.id, id as string);
        const currentSubmission = submissions.find(
          (s) => s.id === submissionId
        );

        if (currentSubmission) {
          setSubmission(currentSubmission);

          // Prepare initial scores from existing judge submissions
          const initialScores: { [key: string]: number } = {};
          currentSubmission.judgeSubmissions.forEach((js) => {
            js.judgeSubmissionDetails.forEach((jsd) => {
              initialScores[jsd.roundMarkCriterion.id] = jsd.score;
            });
          });
          setCriteriaScores(initialScores);

          // Set judge submissions
          setJudgeSubmissions(currentSubmission.judgeSubmissions);
        }
      } catch (error) {
        console.error("Error fetching submission:", error);
      }
    };

    fetchSubmission();
  }, [user, id, submissionId]);

  const handleScoreChange = (criterionId: string, score: number) => {
    setCriteriaScores((prev) => ({
      ...prev,
      [criterionId]: score,
    }));
  };

  const calculateTotalScore = () => {
    return Object.values(criteriaScores).reduce((sum, score) => sum + score, 0);
  };

  const handleSubmit = () => {
    // Simulate submission of judge scores
    console.log("Submitted Scores:", criteriaScores);
    console.log("Total Score:", calculateTotalScore());
    // In a real app, you would send this to your backend
  };

  if (!submission) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Judge Submission</h1>

      {/* Judge Submission Tabs */}
      <div className="flex border-b mb-4">
        {judgeSubmissions.map((js, index) => (
          <button
            key={js.id}
            className="px-4 py-2 text-gray-600 hover:text-blue-600"
          >
            {js.judge.email}
          </button>
        ))}
      </div>

      {/* Submission Details */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Evaluation Criteria</h2>

        {/* Dynamically render mark criteria */}
        {submission.judgeSubmissions[0]?.judgeSubmissionDetails.map(
          (detail) => (
            <div key={detail.roundMarkCriterion.id} className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="font-medium">
                  {detail.roundMarkCriterion.name}
                  <span className="text-sm text-gray-500 ml-2">
                    (Max: {detail.roundMarkCriterion.maxScore})
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  max={detail.roundMarkCriterion.maxScore}
                  value={criteriaScores[detail.roundMarkCriterion.id] || 0}
                  onChange={(e) =>
                    handleScoreChange(
                      detail.roundMarkCriterion.id,
                      Number(e.target.value)
                    )
                  }
                  className="w-20 p-2 border rounded"
                />
              </div>
              <p className="text-sm text-gray-500">
                {detail.roundMarkCriterion.note}
              </p>
            </div>
          )
        )}

        {/* Total Score */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="font-bold">Total Score:</span>
            <span className="text-xl font-bold">
              {calculateTotalScore()}/
              {submission.judgeSubmissions[0]?.judgeSubmissionDetails.reduce(
                (sum, detail) => sum + detail.roundMarkCriterion.maxScore,
                0
              )}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit Evaluation
        </button>
      </div>

      {/* Submission Files */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Submitted Files</h3>
        <div className="grid grid-cols-2 gap-4">
          {submission.fileUrls.map((file) => (
            <div
              key={file.id}
              className="border p-3 rounded flex items-center justify-between"
            >
              <span>{file.fileName}</span>
              <a
                href={file.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
