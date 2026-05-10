import React from "react";
import { Tabs } from "antd";
import MovieList from "./MovieList";
import TheatreList from "./TheatreList";

function Admin() {
  const tabItems = [
    {
      key: "1",
      label: "MovieList",
      children: <MovieList />,
    },

    {
      key: "2",
      label: "TheatreList",
      children: <TheatreList />,
    },
  ];

  return <Tabs items={tabItems} />;
}

export default Admin;