import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  fetchAllUsers,
  fetchUserFriends,
  fetchNoRelationUsers,
} from "../features/userProfileSlice";
import {
  fetchPendingStatus,
  fetchBlockedUsers,
} from "../features/friendsManagmentSlice";
import { getChannelsList } from "../features/chatSlice";

import {
  updateChannelContent,
  updateGlobalState,
} from "../features/globalSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import Cookies from "js-cookie";

export const socket = io("http://localhost:3000", {
  auth: {
    token: Cookies.get("accessToken"),
  },
});

const SocketProvider: React.FC = ({ children }) => {
  const dispatch = useAppDispatch();
  const { refresh } = useAppSelector(
    (state) => state.globalState
  );

  useEffect(() => {
    socket.on("receive_notification", () => {
      dispatch(updateGlobalState());
      console.log("trigger the refresh");
    });
    return () => {
      socket.off("receive_notification");
    };
  }, [socket]);

  // useEffect(() => {
  //   socket.on("receive_message_channel", (data) => {
  //     console.log("trigger the update message", data);
  //     dispatch(addNewMessage(data));
  //   });
  // }, [socket]);

  useEffect(() => {
    if (Cookies.get("accessToken")) {
      dispatch(fetchUserFriends());
      dispatch(fetchAllUsers());
      dispatch(fetchNoRelationUsers());
      dispatch(fetchPendingStatus());
      dispatch(fetchBlockedUsers());
      dispatch(getChannelsList());
      console.log("--------------------> refershhhhhh");
    }
  }, [refresh]);

  return <>{children}</>;
};

export default SocketProvider;
