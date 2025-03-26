import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
} from "recharts";

const API_BASE_URL = "http://141.148.219.190:8000";

const HRCandidateAnalyticsDashboard = () => {
  const { candidateId } = useParams();
  const [matchHistory, setMatchHistory] = useState([]);

  useEffect(() => {
    const fetchMatchHistory = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/verification/match/${candidateId}`);
        const data = await response.json();
        setMatchHistory(data.matches || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchMatchHistory();
  }, [candidateId]);

  const confidenceData = matchHistory.map((match) => ({
    name: `#${match.id}`,
    Confidence: parseFloat((match.confidence_score * 100).toFixed(2)),
  }));

  const framesData = matchHistory.map((match) => ({
    name: `#${match.id}`,
    Matching: match.matching_frames,
    Checked: match.checked_frames,
  }));

  const averageConfidence =
    matchHistory.length > 0
      ? matchHistory.reduce((sum, match) => sum + match.confidence_score * 100, 0) /
        matchHistory.length
      : 0;

  const exportToCSV = () => {
    const header = ["Match ID", "Confidence Score", "Matching Frames", "Checked Frames", "Status"];
    const rows = matchHistory.map((match) => [
      match.id,
      (match.confidence_score * 100).toFixed(2),
      match.matching_frames,
      match.checked_frames,
      match.status,
    ]);
    const csvContent = [header, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `candidate_${candidateId}_match_history.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">📊 Candidate Match Analytics</h2>
        <button
          onClick={exportToCSV}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md"
        >
          ⬇️ Export CSV
        </button>
      </div>

      {/* Score Summary */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow flex justify-between items-center">
        <div>
          <p className="text-lg font-semibold">📈 Average Confidence Score:</p>
          <p className="text-2xl font-bold">{averageConfidence.toFixed(2)}%</p>
        </div>
        <div>
          <p className="text-lg font-semibold">🔍 Overall Status:</p>
          <p className={`text-2xl font-bold ${averageConfidence >= 80 ? "text-green-500" : "text-red-500"}`}>
            {averageConfidence >= 80 ? "✅ Pass" : "❌ Fail"}
          </p>
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-xl">
        <h3 className="text-xl font-semibold mb-4">🎯 Confidence Score Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={confidenceData}>
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="Confidence"
              stroke="#3b82f6"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-xl">
        <h3 className="text-xl font-semibold mb-4">🖼️ Matching vs Checked Frames</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={framesData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Checked" fill="#a855f7" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Matching" fill="#22c55e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HRCandidateAnalyticsDashboard;
