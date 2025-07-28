"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Tag } from "lucide-react";

interface Keyword {
  id: string;
  keyword: string;
  created_at: string;
}

interface KeywordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeywordUpdated?: () => void;
}

export default function KeywordsModal({
  isOpen,
  onClose,
  onKeywordUpdated,
}: KeywordsModalProps) {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchKeywords();
    }
  }, [isOpen]);

  const fetchKeywords = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/keywords");
      const data = await response.json();

      if (response.ok) {
        setKeywords(data.keywords);
      } else {
        setError(data.error || "Failed to fetch keywords");
      }
    } catch (error) {
      console.error("Error fetching keywords:", error);
      setError("Failed to fetch keywords");
    } finally {
      setLoading(false);
    }
  };

  const handleAddKeyword = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedKeyword = newKeyword.trim();
    if (!trimmedKeyword) return;

    if (trimmedKeyword.length > 20) {
      setError("Keyword must be 20 characters or less");
      return;
    }

    if (keywords.length >= 10) {
      setError("Maximum 10 keywords allowed");
      return;
    }

    setAdding(true);
    setError("");

    try {
      const response = await fetch("/api/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: trimmedKeyword }),
      });

      const data = await response.json();

      if (response.ok) {
        setKeywords([...keywords, data.keyword]);
        setNewKeyword("");
        // Notify parent component to refresh item list
        if (onKeywordUpdated) {
          onKeywordUpdated();
        }
      } else {
        setError(data.error || "Failed to add keyword");
      }
    } catch (error) {
      console.error("Error adding keyword:", error);
      setError("Failed to add keyword");
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteKeyword = async (keywordId: string) => {
    try {
      const response = await fetch("/api/keywords", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywordId }),
      });

      if (response.ok) {
        setKeywords(keywords.filter((k) => k.id !== keywordId));
        // Notify parent component to refresh item list
        if (onKeywordUpdated) {
          onKeywordUpdated();
        }
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete keyword");
      }
    } catch (error) {
      console.error("Error deleting keyword:", error);
      setError("Failed to delete keyword");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Tag className="w-5 h-5 text-orange-400" />
            <h3 className="text-lg font-bold text-white">キーワード管理</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add Keyword Form */}
        <form onSubmit={handleAddKeyword} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => {
                setNewKeyword(e.target.value);
                if (error) setError("");
              }}
              placeholder="キーワードを入力..."
              maxLength={20}
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={adding || !newKeyword.trim() || keywords.length >= 10}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {adding ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </button>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{newKeyword.length}/20文字</span>
            <span>{keywords.length}/10キーワード</span>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-600/20 border border-red-500/30 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Keywords List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : keywords.length === 0 ? (
            <div className="text-center py-8">
              <Tag className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">
                まだキーワードが追加されていません
              </p>
              <p className="text-gray-500 text-sm mt-1">
                キーワードを追加して記事をハイライトしましょう
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword) => (
                <span
                  key={keyword.id}
                  className="px-2 py-1 rounded-full text-black text-sm font-medium flex items-center gap-1 group"
                  style={{ backgroundColor: "#f66f3b" }}
                >
                  #{keyword.keyword}
                  <button
                    onClick={() => handleDeleteKeyword(keyword.id)}
                    className="text-black hover:text-red-600 transition"
                    title="キーワードを削除"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="text-xs text-gray-400">
            <p>• キーワードはフィルタリング表示に使えます</p>
            <p>
              • マッチした記事にはフィード名の横にキーワードラベルが表示されます
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
