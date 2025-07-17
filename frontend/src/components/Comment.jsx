import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const Comment = ({ comment }) => {
  if (!comment || !comment.author || !comment.text) {
    return <div className="my-2 text-sm text-gray-500">Comment data is missing</div>;
  }

  return (
    <div className="my-2">
      <div className="flex gap-3 items-center">
        <Avatar>
          <AvatarImage src={comment.author.profilePicture} />
          <AvatarFallback>{comment.author.username?.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <h1 className="font-bold text-sm">
          {comment.author.username}{' '}
          <span className="font-normal pl-1">{comment.text}</span>
        </h1>
      </div>
    </div>
  );
};

export default Comment;