import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import apiRoutes from '../routes';

export const fetchChannels = createAsyncThunk(
  'chat/fetchChannels',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Токен не найден');

      const response = await axios.get(apiRoutes.channelsPath(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteChannel = createAsyncThunk(
  'chat/deleteChannel',
  async (channelId, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(apiRoutes.channelPath(channelId), {
        headers: { Authorization: `Bearer ${token}` },
      });
      return channelId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const changeChannelName = createAsyncThunk(
  'chat/changeChannelName',
  async ({ id, name }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        apiRoutes.channelPath(id),
        { name },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const addChannel = createAsyncThunk(
  'chat/addChannel',
  async (channelData, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(apiRoutes.channelsPath(), channelData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const initialState = {
  channels: [],
  currentChannelId: '1',
  loading: false,
  error: null,
  isLoggedIn: false,
  socketConnected: false,
};

const channelsSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    resetChatState: (state) => ({
      ...state,
      channels: [
        { id: 1, name: 'general', removable: false },
        { id: 2, name: 'random', removable: false },
      ],
      currentChannelId: 1,
      messages: [],
      loading: false,
      error: null,
      socketConnected: false,
    }),
    changeCurrentChannel: (state, action) => ({
      ...state,
      currentChannelId: action.payload,
    }),
    addChannelAction: (state, action) => ({
      ...state,
      channels: [...state.channels, action.payload],
    }),
    deleteChannelAction: (state, action) => ({
      ...state,
      channels: state.channels.filter(
        (channel) => channel.id !== action.payload,
      ),
    }),
    changeChannelNameAction: (state, action) => {
      const updatedChannel = action.payload;
      const channelIndex = state.channels.findIndex(
        (channel) => channel.id === updatedChannel.id,
      );

      if (channelIndex >= 0) {
        const updatedChannels = [
          ...state.channels.slice(0, channelIndex),
          updatedChannel,
          ...state.channels.slice(channelIndex + 1),
        ];
        return {
          ...state,
          channels: updatedChannels,
        };
      }
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => ({
        ...state,
        loading: true,
        error: null,
      }))
      .addCase(fetchChannels.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        channels: action.payload,
      }))
      .addCase(fetchChannels.rejected, (state, action) => ({
        ...state,
        loading: false,
        error: action.payload,
      }))
      .addCase(deleteChannel.pending, (state) => ({
        ...state,
        loading: true,
        error: null,
      }))
      .addCase(deleteChannel.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        channels: state.channels.filter(
          (channel) => channel.id !== action.payload,
        ),
      }))
      .addCase(deleteChannel.rejected, (state, action) => ({
        ...state,
        loading: false,
        error: action.payload,
      }))
      .addCase(changeChannelName.pending, (state) => ({
        ...state,
        loading: true,
        error: null,
      }))
      .addCase(changeChannelName.fulfilled, (state, action) => {
        const updatedChannel = action.payload;
        const channelIndex = state.channels.findIndex(
          (channel) => channel.id === updatedChannel.id,
        );

        if (channelIndex >= 0) {
          const updatedChannels = [
            ...state.channels.slice(0, channelIndex),
            updatedChannel,
            ...state.channels.slice(channelIndex + 1),
          ];

          return {
            ...state,
            loading: false,
            channels: updatedChannels,
          };
        }

        return {
          ...state,
          loading: false,
          error: null,
        };
      })
      .addCase(changeChannelName.rejected, (state, action) => ({
        ...state,
        loading: false,
        error: action.payload,
      }))
      .addCase(addChannel.pending, (state) => ({
        ...state,
        loading: true,
        error: null,
      }))
      .addCase(addChannel.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        channels: [...state.channels, action.payload],
      }))
      .addCase(addChannel.rejected, (state, action) => ({
        ...state,
        loading: false,
        error: action.payload,
      }));
  },
});

export const {
  resetChatState,
  addChannelAction,
  deleteChannelAction,
  changeCurrentChannel,
  changeChannelNameAction,
} = channelsSlice.actions;
export const channelsReducer = channelsSlice.reducer;
