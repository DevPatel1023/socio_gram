import React, { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Plus, X, ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";
import useStory from "../hooks/UseStory";
import { toast } from "sonner";

const STORY_DURATION = 5000;

const Stories = () => {
  const {
    stories,
    myStories,
    uploadStory,
    getAllUserStories,
    getMyStories,
  } = useStory();

  const [combinedStories, setCombinedStories] = useState([]);
  const [currentStory, setCurrentStory] = useState(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [storyTimer, setStoryTimer] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  
  const videoRef = useRef(null);
  const progressRef = useRef(null);

  // Fetch stories on component mount
  useEffect(() => {
    getMyStories();
    getAllUserStories();
  }, []);

  // Map and combine stories
  useEffect(() => {
    console.log("Fetched stories:", stories);
    console.log("Fetched myStories:", myStories);

    const mappedStories = stories.map((story) => ({
      id: story._id,
      username: story.user?.username || "Unknown",
      avatar: story.user?.profilePicture || "",
      isOwn: false,
      hasStory: true,
      timestamp: story.createdAt,
      media: story.mediaUrl,
      type: story.type,
    }));

    let updatedStories = [...mappedStories];

    if (myStories.length > 0) {
      const ownStory = myStories[0];
      const myStoryObject = {
        id: ownStory._id,
        username: "Your Story",
        avatar: ownStory.user?.profilePicture || "",
        isOwn: true,
        hasStory: true,
        timestamp: ownStory.createdAt,
        media: ownStory.mediaUrl,
        type: ownStory.type,
      };
      updatedStories.unshift(myStoryObject);
    } else {
      updatedStories.unshift({
        id: "own",
        username: "Your Story",
        avatar: "",
        isOwn: true,
        hasStory: false,
        timestamp: "now",
      });
    }

    console.log("Combined Stories:", updatedStories);
    setCombinedStories(updatedStories);
  }, [stories, myStories]);

  const handleStoryClick = (story, index) => {
    console.log("Clicked story:", story);
    if (story.isOwn && !story.hasStory) {
      document.getElementById("storyUploadInput").click();
      return;
    }
    setCurrentStory(story);
    setCurrentStoryIndex(index);
    setIsStoryOpen(true);
    setProgress(0);
  };

  const closeStory = () => {
    setIsStoryOpen(false);
    setCurrentStory(null);
    setProgress(0);
    setIsPaused(false);
    if (storyTimer) clearTimeout(storyTimer);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    try {
      const res = await uploadStory(file);
      if (res.success && res.story) {
        toast.success("Story uploaded successfully!");
        await getMyStories();
        await getAllUserStories();

        const newStory = {
          id: res.story._id,
          username: "Your Story",
          avatar: res.story.user?.profilePicture || "",
          isOwn: true,
          hasStory: true,
          timestamp: res.story.createdAt || "now",
          media: res.story.mediaUrl,
          type: res.story.type || "",
        };

        setCurrentStory(newStory);
        setCurrentStoryIndex(0);
        setIsStoryOpen(true);
        setProgress(0);
      } else {
        toast.error("Failed to upload story");
      }
    } catch (err) {
      toast.error("Upload error");
      console.error(err);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const nextStory = () => {
    if (!currentStory || combinedStories.length === 0) return;
    
    const nextIndex = (currentStoryIndex + 1) % combinedStories.length;
    const nextStoryItem = combinedStories[nextIndex];
    
    // Skip stories without media (like "add story" placeholder)
    if (nextStoryItem && !nextStoryItem.hasStory) {
      if (nextIndex + 1 < combinedStories.length) {
        setCurrentStoryIndex(nextIndex + 1);
        setCurrentStory(combinedStories[nextIndex + 1]);
      } else {
        closeStory();
        return;
      }
    } else {
      setCurrentStoryIndex(nextIndex);
      setCurrentStory(nextStoryItem);
    }
    
    setProgress(0);
    setIsPaused(false);
  };

  const prevStory = () => {
    if (!currentStory || combinedStories.length === 0) return;
    
    const prevIndex = currentStoryIndex === 0 ? combinedStories.length - 1 : currentStoryIndex - 1;
    const prevStoryItem = combinedStories[prevIndex];
    
    // Skip stories without media
    if (prevStoryItem && !prevStoryItem.hasStory) {
      if (prevIndex - 1 >= 0) {
        setCurrentStoryIndex(prevIndex - 1);
        setCurrentStory(combinedStories[prevIndex - 1]);
      } else {
        return;
      }
    } else {
      setCurrentStoryIndex(prevIndex);
      setCurrentStory(prevStoryItem);
    }
    
    setProgress(0);
    setIsPaused(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const handleStoryPress = () => {
    setIsPaused(true);
  };

  const handleStoryRelease = () => {
    setIsPaused(false);
  };

  // Handle ESC key to close story
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isStoryOpen) {
        closeStory();
      }
    };

    if (isStoryOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isStoryOpen]);

  // Story auto-play and progress effect
  useEffect(() => {
    if (!currentStory || isPaused) return;
    if (storyTimer) clearTimeout(storyTimer);

    let duration = STORY_DURATION;
    
    // For videos, get actual duration
    if (currentStory.type === "video" && videoRef.current) {
      const videoDuration = videoRef.current.duration;
      if (videoDuration && !isNaN(videoDuration)) {
        duration = videoDuration * 1000;
      }
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
        nextStory();
      }
    }, 50);

    setStoryTimer(interval);

    return () => {
      clearInterval(interval);
    };
  }, [currentStory, isPaused]);

  // Handle video events
  const handleVideoLoadedData = () => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      // Try to play with sound after user interaction
      videoRef.current.play().catch(console.error);
    }
  };

  const handleVideoEnded = () => {
    nextStory();
  };

  const StoryRing = ({ story, index }) => (
    <div className="flex flex-col items-center gap-1 min-w-[70px]">
      <div className="relative">
        <div
          className={`p-[2px] rounded-full ${
            story.isOwn && !story.hasStory
              ? "bg-gray-300"
              : story.hasStory
              ? "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"
              : "bg-gray-300"
          }`}
        >
          <div className="bg-white p-[2px] rounded-full">
            <Avatar className="h-14 w-14 cursor-pointer">
              <AvatarImage
                src={story.avatar || "https://via.placeholder.com/56"}
                alt={`${story.username || "User"}'s story`}
                className="object-cover"
              />
              <AvatarFallback className="text-sm font-medium">
                {(story.username || "NA").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        {story.isOwn && !story.hasStory && (
          <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
            <Plus className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
      <span className="text-xs text-center max-w-[70px] truncate">
        {story.isOwn ? "Your Story" : story.username || "User"}
      </span>
    </div>
  );

  return (
    <>
      <input
        id="storyUploadInput"
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />

      <div className="w-full max-w-sm md:max-w-lg mx-auto bg-white border-b border-gray-200 py-4">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4">
          {combinedStories.length === 0 ? (
            <p className="text-gray-500 text-sm">No stories to show.</p>
          ) : (
            combinedStories.map((story, index) => (
              <div
                key={story.id}
                onClick={() => handleStoryClick(story, index)}
                className="hover:scale-105 transition-transform duration-200"
              >
                <StoryRing story={story} index={index} />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Story Modal Overlay - With dark backdrop */}
      {isStoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
          {/* Story Container */}
          <div className="relative">
            {currentStory && (
              <div className="relative w-80 h-[700px] bg-black rounded-xl overflow-hidden shadow-2xl">
                {/* Progress bars */}
                <div className="absolute top-4 left-4 right-4 flex gap-1 z-30">
                  <div className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-100 ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Header */}
                <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-30 mt-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={currentStory.avatar || "https://via.placeholder.com/40"}
                        alt={currentStory.username || "User"}
                      />
                      <AvatarFallback className="text-xs">
                        {(currentStory.username || "NA").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="text-white text-sm font-medium">
                        {currentStory.username || "User"}
                      </span>
                      <span className="text-gray-300 text-xs ml-2">
                        {currentStory.timestamp}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentStory.type === "video" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleMute}
                        className="text-white hover:bg-gray-700 hover:bg-opacity-50 p-2 rounded-full"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={closeStory}
                      className="text-white hover:bg-gray-700 hover:bg-opacity-50 p-2 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Media content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {currentStory.media ? (
                    currentStory.type === "video" ? (
                      <video
                        ref={videoRef}
                        src={currentStory.media}
                        autoPlay
                        muted={isMuted}
                        playsInline
                        onLoadedData={handleVideoLoadedData}
                        onEnded={handleVideoEnded}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={currentStory.media}
                        alt="Story content"
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : (
                    <img
                      src="/defaultimg.jpg"
                      alt="Static placeholder"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Navigation areas */}
                <div className="absolute inset-0 flex z-20">
                  {/* Previous story area */}
                  <div
                    className="w-1/3 h-full cursor-pointer flex items-center justify-start pl-4 group"
                    onClick={prevStory}
                    onMouseDown={handleStoryPress}
                    onMouseUp={handleStoryRelease}
                    onTouchStart={handleStoryPress}
                    onTouchEnd={handleStoryRelease}
                  >
                    <div className="bg-black bg-opacity-50 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <ChevronLeft className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Pause area (middle) */}
                  <div
                    className="w-1/3 h-full cursor-pointer"
                    onMouseDown={handleStoryPress}
                    onMouseUp={handleStoryRelease}
                    onTouchStart={handleStoryPress}
                    onTouchEnd={handleStoryRelease}
                  />

                  {/* Next story area */}
                  <div
                    className="w-1/3 h-full cursor-pointer flex items-center justify-end pr-4 group"
                    onClick={nextStory}
                    onMouseDown={handleStoryPress}
                    onMouseUp={handleStoryRelease}
                    onTouchStart={handleStoryPress}
                    onTouchEnd={handleStoryRelease}
                  >
                    <div className="bg-black bg-opacity-50 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <ChevronRight className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Pause indicator */}
                {isPaused && (
                  <div className="absolute inset-0 flex items-center justify-center z-25 pointer-events-none">
                    <div className="bg-black bg-opacity-50 rounded-full p-4">
                      <div className="text-white text-2xl">⏸️</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Stories;