import { Clock, MessageCircle, Plus, Save, User, X } from "lucide-react";
import React, { useState } from "react";
import { Comment } from "../types/medical-codes";

interface CommentsSectionProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
  onUpdateComment: (commentId: string, text: string) => void;
  onDeleteComment: (commentId: string) => void;
  icdCode: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  comments,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  icdCode,
}) => {
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const handleAddComment = () => {
    if (newCommentText.trim()) {
      onAddComment(newCommentText.trim());
      setNewCommentText("");
      setIsAddingComment(false);
    }
  };

  const handleStartEdit = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingText(comment.text);
  };

  const handleSaveEdit = () => {
    if (editingCommentId && editingText.trim()) {
      onUpdateComment(editingCommentId, editingText.trim());
      setEditingCommentId(null);
      setEditingText("");
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingText("");
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080)
      return `${Math.floor(diffInMinutes / 1440)}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-4 h-4 text-blue-500" />
          <h4 className="font-medium text-gray-900">Comments for {icdCode}</h4>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {comments.length}
          </span>
        </div>

        {!isAddingComment && (
          <button
            onClick={() => setIsAddingComment(true)}
            className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            <Plus className="w-3 h-3" />
            <span>Add Comment</span>
          </button>
        )}
      </div>

      {/* Add Comment Form */}
      {isAddingComment && (
        <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Add your comment about this ICD code..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
            autoFocus
          />
          <div className="flex items-center justify-end space-x-2 mt-3">
            <button
              onClick={() => {
                setIsAddingComment(false);
                setNewCommentText("");
              }}
              className="px-3 py-1.5 text-gray-600 hover:text-gray-800 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleAddComment}
              disabled={!newCommentText.trim()}
              className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
            >
              <MessageCircle className="w-3 h-3" />
              <span>Add Comment</span>
            </button>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-3">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white rounded-lg p-3 border border-gray-200 group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-blue-600" />
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <span className="font-medium text-gray-900">
                      {comment.author}
                    </span>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimestamp(comment.timestamp)}</span>
                    </div>
                  </div>
                </div>

                {/* <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleStartEdit(comment)}
                    className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="Edit comment"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onDeleteComment(comment.id)}
                    className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete comment"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div> */}
              </div>

              {editingCommentId === comment.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                  />
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center space-x-1 px-2 py-1 text-gray-600 hover:text-gray-800 transition-colors text-xs"
                    >
                      <X className="w-3 h-3" />
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      disabled={!editingText.trim()}
                      className="flex items-center space-x-1 px-2 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-xs"
                    >
                      <Save className="w-3 h-3" />
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {comment.text}
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <MessageCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No comments yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Add the first comment to start the discussion about this ICD code
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
