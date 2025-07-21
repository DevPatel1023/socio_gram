import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Plus, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

const Stories = ({ 
  stories = [
    {
      id: 1,
      username: "Your Story",
      avatar: "",
      isOwn: true,
      hasStory: false,
      timestamp: "now"
    },
    {
      id: 2,
      username: "john_doe",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      hasStory: true,
      isViewed: false,
      timestamp: "2h"
    },
    {
      id: 3,
      username: "sarah_wilson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b9e8f4a3?w=150&h=150&fit=crop&crop=face",
      hasStory: true,
      isViewed: true,
      timestamp: "4h"
    },
    {
      id: 4,
      username: "mike_photography",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      hasStory: true,
      isViewed: false,
      timestamp: "6h"
    },
    {
      id: 5,
      username: "travel_diaries",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      hasStory: true,
      isViewed: true,
      timestamp: "8h"
    },
    {
      id: 6,
      username: "foodie_adventures",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      hasStory: true,
      isViewed: false,
      timestamp: "12h"
    },
    {
      id: 7,
      username: "art_inspiration",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      hasStory: true,
      isViewed: true,
      timestamp: "14h"
    },
    {
      id: 8,
      username: "fitness_journey",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=face",
      hasStory: true,
      isViewed: false,
      timestamp: "16h"
    }
  ]
}) => {
  const [currentStory, setCurrentStory] = useState(null);
  const [isStoryOpen, setIsStoryOpen] = useState(false);

  const handleStoryClick = (story) => {
    if (story.isOwn && !story.hasStory) {
      // Handle adding new story
      return;
    }
    setCurrentStory(story);
    setIsStoryOpen(true);
  };

  const closeStory = () => {
    setIsStoryOpen(false);
    setCurrentStory(null);
  };

  const nextStory = () => {
    const currentIndex = stories.findIndex(s => s.id === currentStory.id);
    const nextIndex = (currentIndex + 1) % stories.length;
    setCurrentStory(stories[nextIndex]);
  };

  const prevStory = () => {
    const currentIndex = stories.findIndex(s => s.id === currentStory.id);
    const prevIndex = currentIndex === 0 ? stories.length - 1 : currentIndex - 1;
    setCurrentStory(stories[prevIndex]);
  };

  const StoryRing = ({ story }) => {
    const ringColor = story.isOwn && !story.hasStory 
      ? "ring-gray-300" 
      : story.hasStory && !story.isViewed 
        ? "ring-gradient-to-r from-purple-500 to-pink-500" 
        : "ring-gray-300";

    return (
      <div className="flex flex-col items-center gap-1 min-w-[70px]">
        <div className="relative">
          <div
            className={`p-[2px] rounded-full ${
              story.isOwn && !story.hasStory 
                ? "bg-gray-300" 
                : story.hasStory && !story.isViewed 
                  ? "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500" 
                  : "bg-gray-300"
            }`}
          >
            <div className="bg-white p-[2px] rounded-full">
              <Avatar className="h-14 w-14 cursor-pointer">
                <AvatarImage 
                  src={story.avatar} 
                  alt={`${story.username}'s story`}
                  className="object-cover"
                />
                <AvatarFallback className="text-sm font-medium">
                  {story.username.slice(0, 2).toUpperCase()}
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
          {story.isOwn ? "Your Story" : story.username}
        </span>
      </div>
    );
  };

  return (
    <>
      {/* Stories Container */}
      <div className="w-full max-w-sm md:max-w-lg mx-auto bg-white border-b border-gray-200 py-4">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4">
          {stories.map((story) => (
            <div
              key={story.id}
              onClick={() => handleStoryClick(story)}
              className="hover:scale-105 transition-transform duration-200"
            >
              <StoryRing story={story} />
            </div>
          ))}
        </div>
      </div>

      {/* Story Viewer Dialog */}
      <Dialog open={isStoryOpen} onOpenChange={setIsStoryOpen}>
        <DialogContent className="max-w-sm mx-auto p-0 bg-black border-0 overflow-hidden">
          {currentStory && (
            <div className="relative h-[600px] bg-black">
              {/* Story Progress Bars */}
              <div className="absolute top-4 left-4 right-4 flex gap-1 z-20">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden"
                  >
                    <div
                      className="h-full bg-white transition-all duration-300"
                      style={{ width: index === 0 ? "100%" : "0%" }}
                    />
                  </div>
                ))}
              </div>

              {/* Story Header */}
              <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-20 mt-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentStory.avatar} alt={currentStory.username} />
                    <AvatarFallback className="text-xs">
                      {currentStory.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="text-white text-sm font-medium">
                      {currentStory.username}
                    </span>
                    <span className="text-gray-300 text-xs ml-2">
                      {currentStory.timestamp}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeStory}
                  className="text-white hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Story Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop"
                  alt="Story content"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Navigation Areas */}
              <div className="absolute inset-0 flex">
                <div
                  className="w-1/3 h-full cursor-pointer flex items-center justify-start pl-4"
                  onClick={prevStory}
                >
                  <ChevronLeft className="w-6 h-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
                </div>
                <div className="w-1/3 h-full" />
                <div
                  className="w-1/3 h-full cursor-pointer flex items-center justify-end pr-4"
                  onClick={nextStory}
                >
                  <ChevronRight className="w-6 h-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Story Actions */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Reply to story..."
                  className="flex-1 bg-transparent border border-gray-600 rounded-full px-4 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-white"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-gray-800"
                >
                  ❤️
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Stories;