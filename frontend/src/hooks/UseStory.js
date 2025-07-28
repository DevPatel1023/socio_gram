// src/hooks/useStory.js
import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000/api/v1/story";

const useStory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stories, setStories] = useState([]);
  const [myStories, setMyStories] = useState([]);

  //  Get stories from followed users (Feed)
  const getAllUserStories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/feed`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setStories(res.data.stories);
      }
    } catch (err) {
      setError(err);
      console.error("Error fetching feed stories", err);
    } finally {
      setLoading(false);
    }
  };

  // Get stories of the current logged-in user
  const getMyStories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/me`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setMyStories(res.data.myStories);
      }
    } catch (err) {
      setError(err);
      console.error("Error fetching my stories", err);
    } finally {
      setLoading(false);
    }
  };

  //  Upload a new story (image or video)
  const uploadStory = async (file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("media", file);

      const res = await axios.post(`${API_BASE}/addstory`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    } catch (err) {
      setError(err);
      console.error("Error uploading story", err);
    } finally {
      setLoading(false);
    }
  };

  // Mark a story as viewed (PATCH /:id/view)
  const markStoryAsViewed = async (storyId) => {
    try {
      const res = await axios.patch(`${API_BASE}/${storyId}/view`, null, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      setError(err);
      console.error("Error marking story as viewed", err);
    }
  };

  //  Get viewers of a story (GET /:id/views)
  const getStoryViewers = async (storyId) => {
    try {
      const res = await axios.get(`${API_BASE}/${storyId}/views`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      setError(err);
      console.error("Error fetching story viewers", err);
    }
  };

  //  Delete a user's own story (DELETE /:id)
  const deleteStory = async (storyId) => {
    try {
      const res = await axios.delete(`${API_BASE}/${storyId}`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      setError(err);
      console.error("Error deleting story", err);
    }
  };

  // Auto fetch stories on mount
  useEffect(() => {
    getAllUserStories();
  }, []);

  return {
    loading,
    error,
    stories,
    myStories,
    uploadStory,
    getAllUserStories,
    getMyStories,
    markStoryAsViewed,
    getStoryViewers,
    deleteStory,
  };
};

export default useStory;
