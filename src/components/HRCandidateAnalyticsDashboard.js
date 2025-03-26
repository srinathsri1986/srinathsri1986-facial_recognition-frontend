import React, { useEffect, useState } from "react";
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
  const [matchHistory, setMatchHistory] = useState([]);
  const [candidateList, setCandidateList] = useState([]);
  const [candidateId, setCandidateId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minConfidence, setMinConfidence] = useState("");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ limit: 50, offset: 0 });

  const fetchCandidates = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/hr/candidates`);
      const data = await res.json();
      setCandidateList(data.candidates || []);
    } catch (err) {
      console.error("Error fetching candidates:", err);
    }
  };

  const fetchMatchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: pagination.limit,
        offset: pagination.offset,
      });
      if (candidateId) params.append("candidate_id", candidateId);
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);
      if (minConfidence) params.append("min_confidence", minConfidence);

      const res = await fetch(`${API_BASE_URL}/api/verification/match/all?${params.toString()}`);
      const data = await res.json();
      setMatchHistory(data.matches || []);
    } catch (err) {
      console.error("Error fetching match data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
    fetchMatchData();
  }, [pagination.offset]);

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
      ? matchHistory.reduce((sum, match) => sum + match.confidence_score * 100, 0) / matchHistory.length
      : 0;

  const exportToCSV = () => {
    const header = ["Match ID", "Candidate", "Confidence Score", "Matching Frames", "Checked Frames", "Status"];
    const rows = matchHistory.map((match) => [
      match.id,
      `${match.candidate?.first_name || ""} ${match.candidate?.last_name || ""}`,
      (match.confidence_score * 100).toFixed(2),
      match.matching_frames,
      match.checked_frames,
      match.status,
    ]);
    const csvContent = [header, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `candidate_analytics.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrev = () => {
    setPagination((prev) => ({ ...prev, offset: Math.max(prev.offset - prev.limit, 0) }));
  };

  const handleNext = () => {
    setPagination((prev) => ({ ...prev, offset: prev.offset + prev.limit }));
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">📊 Match Analytics Dashboard</h2>
        <button
          onClick={exportToCSV}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md"
        >
          ⬇️ Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
        <div>
          <label className="block text-sm font-medium mb-1">Candidate</label>
          <select
            value={candidateId}
            onChange={(e) => setCandidateId(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700"
          >
            <option value="">All</option>
            {candidateList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.first_name} {c.last_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Min Confidence</label>
          <input
            type="number"
            step="0.01"
            max="1"
            min="0"
            value={minConfidence}
            onChange={(e) => setMinConfidence(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700"
          />
        </div>
        <div>
          <button
            onClick={fetchMatchData}
            className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
          >
            🔍 Apply Filters
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow flex justify-between items-center">
        <div>
          <p className="text-lg font-semibold">📈 Avg. Confidence:</p>
          <p className="text-2xl font-bold">{averageConfidence.toFixed(2)}%</p>
        </div>
        <div>
          <p className="text-lg font-semibold">🔍 Status:</p>
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
            <Line type="monotone" dataKey="Confidence" stroke="#3b82f6" strokeWidth={3} />
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

      {/* Pagination Controls */}
      <div className="flex justify-end space-x-4 mt-4">
        <button onClick={handlePrev} disabled={pagination.offset === 0} className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
          ⬅️ Previous
        </button>
        <button onClick={handleNext} className="px-4 py-2 bg-blue-500 text-white rounded">
          Next ➡️
        </button>
      </div>
    </div>
  );
};

export default HRCandidateAnalyticsDashboard;
