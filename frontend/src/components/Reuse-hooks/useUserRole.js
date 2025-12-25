import { useState, useEffect } from "react";
import { host } from "../Alert-box/Alert";
import axios from "axios";

export const useuserRole = () => {
  const [userRole, setUserRole] = useState("user");

  useEffect(() => {
    const roleFetch = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUserRole("user");
        return;
      }

      try {
        const res = await axios.post(`${host}/user_profile`, {}, { headers: { token } });
        const payload = res?.data;
        const role = payload?.data?.role || "user";
        setUserRole(role);
      } catch (err) {
        setUserRole("user");
        console.error("Failed to fetch user role:", err);
      }
    };

    roleFetch();
  }, []); 

  return userRole; 
};