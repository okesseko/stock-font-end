import React from "react";
import { NavLink} from "react-router-dom";

const RouterLink = () => {
  return (
    <ul className="m-4">
      <li className="underline ">
        <NavLink to="/" exact>
          main
        </NavLink>
      </li>
      <li className="underline">
        <NavLink to="/echart-example">echart example</NavLink>
      </li>
    </ul>
  );
};

export default RouterLink;
