import React, { useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useSelector, useDispatch } from 'react-redux';
import { Heart, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { markLikeNotificationAsRead } from '@/redux/rtnSlice';

const Notification = () => {
  const { likeNotification } = useSelector((store) => store.realTimeNotification);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(markLikeNotificationAsRead());
  }, [dispatch]);

  const handleNotificationClick = (notification) => {
    if (notification.postId) {
      navigate(`/post/${notification.postId}`);
    }
  };

console.log(likeNotification);

  const formatTime = (timestamp) => {
    if (!timestamp) return 'now';
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'recently';
    }
  };

  return (
    <div className='md:w-[90%] w-screen md:pl-3 min-h-screen bg-white'>
      <div className="max-w-md mx-auto md:max-w-none">
        <div className="bg-white border-b border-gray-200 px-4 py-4 md:px-6">
          <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
        </div>

        <div className="px-4 md:px-6 py-4">
          {likeNotification && likeNotification.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">Recent</h2>
              <div className="space-y-3">
                {likeNotification.map((notification, index) => (
                  <div
                    key={notification.postId || notification.userId || index}
                    className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200 cursor-pointer"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={notification.userDetails?.profilePicture}
                        alt={notification.userDetails?.username || 'User'}
                      />
                      <AvatarFallback className="bg-gray-100">
                        <User size={20} className="text-gray-500" />
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-semibold">
                          {notification.userDetails?.username || 'Someone'}
                        </span>
                        <span className="text-gray-700"> liked your post.</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>

                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center">
                        <Heart size={16} className="text-red-500 fill-current" />
                      </div>
                    </div>

                    {notification?.post && (
                      <div className="flex-shrink-0">
                        <img
                          src={notification.post?.image}
                          alt="Post"
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Heart size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">You're all caught up!</h3>
              <p className="text-gray-500 text-sm max-w-xs">
                When someone likes or comments on your posts, you'll see it here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
