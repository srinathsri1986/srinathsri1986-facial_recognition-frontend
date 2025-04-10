import React, { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  MessageSquare,
  Image,
  File
} from 'lucide-react';
import { format } from 'date-fns';

const FaceMatchHistory = ({ matchHistory, onSendMail, hrEmail }) => {
  const [comments, setComments] = useState({});

  const handleCommentChange = (matchId, value) => {
    setComments((prev) => ({ ...prev, [matchId]: value }));
  };

  const handleSendComment = (matchId, candidateEmail) => {
    const comment = comments[matchId];
    if (comment) {
      onSendMail(hrEmail, comment);
      setComments((prev) => ({ ...prev, [matchId]: '' }));
    }
  };

  const getStatusIcon = (status, match_found) => {
    switch (status) {
      case 'Match Found':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'No Match':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return match_found ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <Clock className="h-5 w-5 text-gray-500" />
        );
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'PPPppp');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center mb-4">
        <UserCheck className="h-6 w-6 mr-2 text-indigo-500" />
        <h3 className="text-xl font-semibold text-gray-800">🧠 Face Match History</h3>
      </div>

      {matchHistory && matchHistory.length > 0 ? (
        <ul className="space-y-4">
          {matchHistory.map((match, index) => (
            <li
              key={index}
              className={`bg-white rounded-lg shadow-md border p-4 ${
                match.match_found
                  ? 'border-green-500/50 bg-green-50/50'
                  : 'border-red-500/50 bg-red-50/50'
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2 flex-grow">
                  <p className="text-sm text-gray-600">
                    <strong>Date/Time:</strong> {formatDate(match.created_at)}
                  </p>
                  <p><strong>Match ID:</strong> {match.id}</p>
                  <p className="text-blue-600">
                    <strong>Confidence:</strong> {(match.confidence_score * 100).toFixed(2)}%
                  </p>
                  <p>
                    <strong>Matching Frames:</strong> {match.matching_frames} / {match.checked_frames}
                  </p>
                  <p>
                    <strong>Candidate:</strong> {match.candidate.first_name} {match.candidate.last_name} ({match.candidate.email})
                  </p>

                  {match.candidate.photo && (
                    <p>
                      <strong>Photo:</strong>{' '}
                      <a href={match.candidate.photo} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center">
                        <Image className="inline-block h-4 w-4 mr-1" /> View Photo
                      </a>
                    </p>
                  )}
                  {match.candidate.resume && (
                    <p>
                      <strong>Resume:</strong>{' '}
                      <a href={match.candidate.resume} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center">
                        <File className="inline-block h-4 w-4 mr-1" /> View Resume
                      </a>
                    </p>
                  )}
                  {match.candidate.id_proof && (
                    <p>
                      <strong>ID Proof:</strong>{' '}
                      <a href={match.candidate.id_proof} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center">
                        <File className="inline-block h-4 w-4 mr-1" /> View ID Proof
                      </a>
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center ${
                      match.match_found
                        ? 'bg-green-100/80 text-green-700'
                        : 'bg-red-100/80 text-red-700'
                    }`}
                  >
                    {getStatusIcon(match.status, match.match_found)}
                    <span className="ml-1">{match.status}</span>
                  </span>
                </div>
              </div>

              {/* Comment box */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <textarea
                  placeholder="HR Approver Comments..."
                  value={comments[match.id] || ''}
                  onChange={(e) => handleCommentChange(match.id, e.target.value)}
                  className="w-full p-2 text-sm border rounded"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => handleSendComment(match.id, match.candidate.email)}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm px-3 py-1 rounded flex items-center"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" /> Submit Comment
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-600 border border-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mx-auto mb-2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 0 9 9 0 0118 0z"
            />
          </svg>
          No face match history available.
        </div>
      )}
    </div>
  );
};

export default FaceMatchHistory;
