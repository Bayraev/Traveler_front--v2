import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { MapState } from '../../types';
import siteConfig from '../../config/siteConfig.json';

const initialState: MapState = {
  longitude: siteConfig.map.defaultCenter.longitude,
  latitude: siteConfig.map.defaultCenter.latitude,
  zoom: siteConfig.map.defaultZoom,
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setMapPosition: (state, action: PayloadAction<Partial<MapState>>) => {
      Object.entries(action.payload).forEach(([key, value]) => {
        if (value !== undefined && value !== state[key as keyof MapState]) {
          state[key as keyof MapState] = value;
        }
      });
    },
    resetMapPosition: () => initialState,
  },
});

export const { setMapPosition, resetMapPosition } = mapSlice.actions;
export default mapSlice.reducer;
