import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";
import { User } from "./userProfileSlice";
const initialState: {
  isFriend: boolean;
  sentReq: boolean;
  acceptReq: boolean;
  pendingReq: boolean;
  pendingUsers: User[];
} = {
  isFriend: false,
  sentReq: false,
  acceptReq: false,
  pendingReq: false,
  pendingUsers: [],
};

// fetch the friends managment endpoints
// friends array fetch

export const fetchRequestStatus = createAsyncThunk(
  "user/fetchRequestStatus",
  async (id: string, _api) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/users/friend-request`,
        {
          recipientId: id,
        },
        {
          headers: {
            authorization: `Bearer ${Cookies.get("jwt")}`,
          },
        }
      );
      return _api.fulfillWithValue(response.data);
    } catch (error: any) {
      return _api.rejectWithValue(error);
    }
  }
);

export const fetchPendingStatus = createAsyncThunk(
  "user/fetchPendingStatus",
  async (_, _api) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/users/pending-friends`,
        {
          headers: {
            authorization: `Bearer ${Cookies.get("jwt")}`,
          },
        }
      );
      console.log("pending friends >> ", response.data);
      return _api.fulfillWithValue(response.data);
    } catch (error: any) {
      return _api.rejectWithValue(error);
    }
  }
);

export const friendsManagementSlice = createSlice({
  name: "friendsManagment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchRequestStatus.fulfilled, (state, action: any) => {
      state.sentReq = false;
      state.pendingReq = true;
      state.acceptReq = false;
    });
    builder.addCase(fetchPendingStatus.fulfilled, (state, action: any) => {
      state.pendingUsers = action.payload;
      state.sentReq = true;
      state.pendingReq = true;
      state.acceptReq = false;
    });
  },
});

export default friendsManagementSlice.reducer;

/* 

useEffect(() => 
{
  socket.on("updateNotifaction", (data) =>
  {
    setData(data)    
  })
}, [socket])

useEffect(()=>
{

}, [data])
*/
