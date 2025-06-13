import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { Status } from "../models/Status"
import { INote } from "../models/Note"
import IFolder from "../models/Folder"
import AquariumService from "../services/AquariumService"

interface IFS {
  totalSpace: number | null
  usedSpace: number | null
  freeSpace: number | null
}

interface IAquarium {
  chipTemp: number | null
  fs: IFS
  status: Status
}

const initialState: IAquarium = {
  chipTemp: null,
  fs: {
    totalSpace: null,
    usedSpace: null,
    freeSpace: null
  },
  status: Status.Idle
}

const AquariumSlice = createSlice({
  name: 'aquarium',
  initialState,
  reducers: {
    // setSettingStatusIdle(state) {
    //   console.log("setIdle")
    //   state.settingStatus = Status.Idle
    // }
  },
  extraReducers(builder) {
    builder

      .addCase(getChipTemp.pending, (state: IAquarium) => {
        state.status = Status.Loading
      })
      .addCase(getChipTemp.fulfilled, (state: IAquarium, action) => {
        state.status = Status.Succeeded
        state.chipTemp = action.payload.temp
      })


      .addCase(getFSInfo.pending, (state: IAquarium) => {
        state.status = Status.Loading
      })
      .addCase(getFSInfo.fulfilled, (state: IAquarium, action) => {
        state.status = Status.Succeeded
        state.fs = action.payload
      })
  }
})


export const getChipTemp = createAsyncThunk(
  'aquarium/getChipTemp',

  async () => {
    return await new AquariumService().getChipTemp()
  })

export const getFSInfo = createAsyncThunk(
  'aquarium/getFSInfo',

  async () => {
    return await new AquariumService().getFSInfo()
  })

// export const {
//   setSettingStatusIdle
// } = AquariumSlice.actions
export default AquariumSlice.reducer