import { createSlice } from '@reduxjs/toolkit'
import { nanoid } from '@reduxjs/toolkit'
import config from './../../config';
let { workersCount, companyCount } = config;


function generateWorkers(count) {
  for (let i = count; i > 0; i--)
  {
    let companyId = Math.floor(Math.random() * (companyCount - 1 + 1) + 1);
    let temp = {
      'id': nanoid(),
      'surname': `Фамилия ${i}`,
      'name': `Имя ${i}`,
      'job': `Компания ${companyId}`,
      'company': companyId
    }
    initialState.list.push(temp);
  }
}

const initialState = {
  inc: workersCount,
  list: []
}

generateWorkers(workersCount);

export const workersSlice = createSlice({
  name: 'workers',
  initialState,
  reducers: {
add: (state, action) => {
    state.inc++;
    let companyIds = action.payload;
    
    companyIds.forEach(companyId => {
        let temp = {
            'id': nanoid(),
            'surname': `Фамилия ${state.inc}`,
            'name': `Имя ${state.inc}`,
            'job': `Компания ${companyId}`,
            'company': companyId
        }
        state.list.unshift(temp);
    });
},
    remove: (state, action) => {
        state.list = state.list.filter(worker => worker.id !== action.payload.id);
    },
    edit: (state, action) => {
      let temp = [...state.list];
      temp[temp.findIndex(c => c.id === action.payload.id)][action.payload.param] = action.payload.content;
      state.list = temp;
    }
  },
})

export const { add, remove, edit } = workersSlice.actions

export default workersSlice.reducer