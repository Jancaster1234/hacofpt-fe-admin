interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Tabs({ activeTab, setActiveTab }: TabsProps) {
  return (
    <div className="flex space-x-4 border-b mb-4">
      {["assignJudgeToRound", "judge", "device", "sponsorship"].map((tab) => (
        <button
          key={tab}
          className={`p-2 ${
            activeTab === tab
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab(tab)}
        >
          {tab === "assignJudgeToRound"
            ? "Assign Judge to Round"
            : tab === "judge"
            ? "Judge Assign"
            : tab === "device"
            ? "Device Management"
            : "Sponsorship"}
        </button>
      ))}
    </div>
  );
}
