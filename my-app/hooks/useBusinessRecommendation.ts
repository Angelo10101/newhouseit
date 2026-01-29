import { useState } from 'react';

// Backend API URL - in production, this should be configurable
const API_URL = 'http://localhost:3001';

export interface Business {
  id: string;
  name: string;
  category: string;
  description: string;
}

export interface RecommendationResponse {
  recommendedBusinessId: string;
  confidence: number;
  reason: string;
}

export const useBusinessRecommendation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecommendation = async (
    userProblem: string,
    businesses: Business[]
  ): Promise<RecommendationResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/recommend-business`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProblem,
          businesses,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data: RecommendationResponse = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get recommendation';
      setError(errorMessage);
      console.error('Error getting recommendation:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getRecommendation,
    loading,
    error,
  };
};
