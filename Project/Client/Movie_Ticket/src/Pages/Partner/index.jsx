 import React from "react";
import { Tabs } from "antd";
import TheatreListPartner from "./TheatreListPartner";

function Partner() {
  const tabItems = [
    {
      key: "1",
      label: "TheatreList",
      children:<TheatreListPartner/>,
    },
  ];

  return <Tabs items={tabItems} />;
}

export default Partner;