import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/context/auth.context.jsx";
import HomeGlobalSearch from "../pages/HomeGlobalSearch.jsx";

const HomeView = () => {
  return (
    <div>
      <HomeGlobalSearch />
    </div>
  );
};

export default HomeView;