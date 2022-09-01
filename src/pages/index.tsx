import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "store/Auth";
import client from "utils/axios";

import { routePath } from "./path";

import PageLogin from "./Login";
import PageTodos from "./Todos";

export default function Pages() {
  const [{ auth }] = useAuth();

  useEffect(() => {
    if (!auth) return;

    const authToken = "Bear " + auth.accessToken;

    const id = client.interceptors.request.use((request) => {
      request.headers!.Authorization = authToken;
      return request;
    });
    return () => client.interceptors.request.eject(id);
  }, [auth]);

  if (!auth)
    return (
      <Routes>
        <Route path={routePath.login} element={<PageLogin />} />
        <Route path="*" element={<Navigate to={routePath.login} />} />
      </Routes>
    );
  else
    return (
      <Routes>
        <Route path={routePath.home} element={<PageTodos />} />
        <Route path="*" element={<Navigate to={routePath.home} />} />
      </Routes>
    );
}
