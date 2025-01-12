import type { Schema } from '@microsoft/parsers-logic-apps';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface StaticResultsState {
  schemas: Record<string, Schema>; // { [connectorid-operationid]: Schema }
  properties: Record<string, any>; // { [nodeId+0](propertyName): any
}

interface StaticResultsSchemaUpdateEvent {
  id: string;
  schema: Schema;
}

export const initialState: StaticResultsState = {
  schemas: {},
  properties: {},
};

export const staticResultsSlice = createSlice({
  name: 'staticResults',
  initialState,
  reducers: {
    initializeStaticResultProperties: (state, action: PayloadAction<Record<string, any>>) => {
      state.properties = action.payload;
    },
    addResultSchema: (state, action: PayloadAction<StaticResultsSchemaUpdateEvent>) => {
      state.schemas[action.payload.id] = action.payload.schema;
    },
    updateProperties: (state, action: PayloadAction<{ name: string; properties: any }>) => {
      state.properties[action.payload.name] = action.payload.properties;
    },
  },
});

export const { initializeStaticResultProperties, addResultSchema, updateProperties } = staticResultsSlice.actions;

export default staticResultsSlice.reducer;
