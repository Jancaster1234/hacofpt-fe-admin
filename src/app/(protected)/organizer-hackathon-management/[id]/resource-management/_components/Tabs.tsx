interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Tabs({ activeTab, setActiveTab }: TabsProps) {
  return (
    <div className="flex space-x-4 border-b mb-4">
      {[
        "round",
        "userManagement",
        "assignJudgeToRound",
        "judge",
        "submission",
        "hackathonResult",
        "device",
        "sponsorship",
      ].map((tab) => (
        <button
          key={tab}
          className={`p-2 ${
            activeTab === tab
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab(tab)}
        >
          {tab === "round"
            ? "Rounds"
            : tab === "userManagement"
            ? "User Management"
            : tab === "assignJudgeToRound"
            ? "Assign Judge to Round"
            : tab === "judge"
            ? "Judge Assign"
            : tab === "submission"
            ? "Submissions"
            : tab === "hackathonResult"
            ? "Results"
            : tab === "device"
            ? "Device Management"
            : "Sponsorship"}
        </button>
      ))}
    </div>
  );
}
