import React from "react";
import Globe, { GlobeMethods } from "react-globe.gl";

import TimePoint from "../components/TimePoint";

import { Pin } from "../types/pins";
import { Story } from "../types/story";

import Stories from "./Stories";
import { story1 } from "../stories/story-1";
import { story2 } from "../stories/story-2";
import { story3 } from "../stories/story-3";
import { story4 } from "../stories/story-4";
import { story5 } from "../stories/story-5";
import { story6 } from "../stories/story-6";
import StoryCarousel from "../components/Story/StoryCarroussel";
import BackButton from "../components/BackButton";

interface EarthSimulationProps {
  imageUrl: string;
  globeRef: React.MutableRefObject<GlobeMethods | undefined>;
  backgroundUrl: string;
  setSelectedPin: (pin: Pin) => void;
  pins: Pin[];
}

const EarthSimulation: React.FC<EarthSimulationProps> = ({
  imageUrl,
  backgroundUrl,
  globeRef,
  pins,
  setSelectedPin,
}) => {
  const formatPin = (pinObj: object) => {
    const pin = pinObj as Pin;
    const p = document.createElement("div");
    const svg = document.createElement("svg");
    p.className = "flex flex-col flex-wrap items-center justify-center";

    const toolTip = document.createElement("div");
    toolTip.innerHTML = pin.label || "";
    toolTip.style.visibility = "hidden";
    toolTip.style.backgroundColor = "rgba(30, 41, 59, 0.6)";
    toolTip.style.padding = ".2rem";
    toolTip.style.color = "white";
    toolTip.style.borderRadius = "5px";
    toolTip.style.transform = "translate(0, -100%)";

    svg.setHTMLUnsafe(
      '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="red" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>'
    );

    // Lucide map-pin icon
    p.style.color = "red";

    svg.style.transform = "translate(0, -100%)";

    p.appendChild(toolTip);
    p.appendChild(svg);
    p.style.pointerEvents = "auto";
    p.style.cursor = "pointer";
    p.onmouseenter = () => (toolTip.style.visibility = "visible");
    p.onmouseleave = () => (toolTip.style.visibility = "hidden");
    p.onclick = () => setSelectedPin(pin);
    return p;
  };

  return (
    <div className="overflow-hidden overflow-y-hidden">
      <Globe
        ref={globeRef}
        globeImageUrl={imageUrl}
        backgroundImageUrl={backgroundUrl}
        animateIn={true}
        htmlElementsData={pins}
        htmlElement={(p) => formatPin(p)}
      />
    </div>
  );
};

const Simulation: React.FC<{ onClose: () => void }> = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const extinctionStories = [story1, story2, story3, story4, story5, story6];

  const [isStoryModalOpen, setIsStoryModalOpen] =
    React.useState<boolean>(false);

  const [selectedStory, setSelectedStory] = React.useState<Story>();
  const [currentPinList, setCurrentPinList] = React.useState<Pin[]>([]);
  const [selectedPin, setSelectedPin] = React.useState<Pin | undefined>();
  const [selectedFrameIndex, setSelectedFrameIndex] = React.useState<number>(0);

  const [backgroundUrl, setBackgroundUrl] = React.useState<string>("");
  const [imageUrl, setImageUrl] = React.useState<string | undefined>("");

  const globeRef = React.useRef<GlobeMethods | undefined>();
  const rotate = async (
    globeRef: React.MutableRefObject<GlobeMethods | undefined>
  ) => {
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      controls.enableRotate = false;
      controls.autoRotate = true;
      globeRef.current.pointOfView({ lat: 0, lng: 0 });
      for (let i = 130; i > 0; i -= 1) {
        controls.autoRotateSpeed = i;
        await new Promise((resolve) => setTimeout(resolve, 0.2));
      }
      controls.enableRotate = true;
      controls.autoRotate = false;
    }
    setTimeout(() => {
      setBackgroundUrl("./background.jpg");
    }, 300);
  };

  React.useEffect(() => {
    // rotate(globeRef);
  }, []);

  React.useEffect(() => {
    setImageUrl(selectedStory?.globeImg);
    setIsStoryModalOpen(false);
    // rotate(globeRef);

    if (selectedFrameIndex !== undefined) {
      setCurrentPinList(selectedStory?.frames[selectedFrameIndex].pins || []);
    } else {
      setCurrentPinList([]);
    }
  }, [selectedFrameIndex, selectedStory]);

  React.useEffect(() => {
    if (selectedPin) {
      console.log("aaaa");
    }
  }, [selectedPin]);

  const Timeline: React.FC = () => {
    return (
      // <div className="absolute grid grid-cols-6 md:gap-x-18 lg:gap-x-24 z-10 rounded-full top-3 left-1/2 transform -translate-x-1/2 bg-slate-500 w-4/6 lg:w-3/6 h-[2vh] text-transparent pointer-events-auto cursor-pointer" onClick={() => setIsStoryModalOpen(true)}>
      <div
        className="absolute grid grid-cols-6 md:gap-x-18 lg:gap-x-24 z-10 rounded-full bottom-3 left-1/2 transform -translate-x-1/2 bg-slate-500 w-4/6 lg:w-3/6 h-[2vh] text-transparent pointer-events-auto cursor-pointer"
        onClick={() => setIsStoryModalOpen(true)}
      >
        {extinctionStories.map((story) => {
          return (
            <>
              <TimePoint
                title={story.title}
                selected={selectedStory === story}
              />
            </>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div id="simulation" className="relative">
        {isStoryModalOpen == false && selectedStory == null && (
          <div className="absolute top-0 left-0 z-10 m-16">
            <BackButton onClick={onClose} />
          </div>
        )}
        {/* // TODO - arrumar overflow y do frame */}
        <Stories
          isOpen={isStoryModalOpen}
          onClose={() => setIsStoryModalOpen(false)}
          stories={extinctionStories}
          onSelectStory={(story) => setSelectedStory(story)}
        />
        {selectedStory && (
          <StoryCarousel
            storyFrames={selectedStory.frames}
            onClose={() => setSelectedStory(undefined)}
          />
        )}
        <Timeline />
        <EarthSimulation
          imageUrl={imageUrl ? imageUrl : "./nowadays.png"}
          globeRef={globeRef}
          backgroundUrl={backgroundUrl}
          setSelectedPin={setSelectedPin}
          pins={selectedStory?.frames[selectedFrameIndex].pins || []}
        />
      </div>
    </>
  );
};

export default Simulation;
