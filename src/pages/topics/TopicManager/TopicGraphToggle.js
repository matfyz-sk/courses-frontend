import React from "react";
import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab";
import {MdDeviceHub, MdFormatAlignLeft} from "react-icons/md";


function TopicGraphToggle({showGraph, setShowGraph}) {

  const handleGraphToggle = (event, newState) => {
    setShowGraph(newState);
  };

  return (
    <ToggleButtonGroup
      style={{paddingBottom: "10px"}}
      value={showGraph}
      exclusive
      onChange={handleGraphToggle}
    >
      <ToggleButton value={true} aria-label="show graph">
        <MdDeviceHub />
      </ToggleButton>
      <ToggleButton value={false} aria-label="show infobox">
        <MdFormatAlignLeft />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export default TopicGraphToggle
