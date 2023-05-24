import { Post } from '@/types/types';
import React from 'react';

type PostProps = {
  post: Post;
};

const PostContent: React.FC<PostProps> = ({ post }) => {
  const { title, images, video, description, dateCreated, slug, uid } = post;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>

      {images.length > 0 && (
        <div className="mb-8">
          <div className="flex space-x-4">
            {images.map((image: string, index: number) => (
              <img key={index} src={image} alt={`Image ${index}`} className="w-1/2" />
            ))}
          </div>
        </div>
      )}

      {/* Video */}
      {video && (
        <div className="mb-8">
          <video src={video} controls className="w-full" />
        </div>
      )}

      <p className="mb-4">{description}</p>
      <p className="text-gray-500">Posted Date: {dateCreated.toString()}</p>
    </div>
  );
};

export default PostContent;
