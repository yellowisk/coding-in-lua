import React from "react";
import { story1 } from "../stories/story-1";
import StoryCover from "../components/Story/Story";
import { story2 } from "../stories/story-2";

import styled from "styled-components";
import BackButton from "../components/BackButton";

const StoriesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Stories: React.FC = () => {
  const stories = [story1, story2];
  return (
    <div className="p-16">
      <BackButton />
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 drop-shadow-lg mb-8">
       Stories
      </h1>
      <StoriesContainer>
        {stories.map((story) => (
          <StoryCover story={story} />
        ))}
      </StoriesContainer>
    </div>
  );
};
export default Stories;
