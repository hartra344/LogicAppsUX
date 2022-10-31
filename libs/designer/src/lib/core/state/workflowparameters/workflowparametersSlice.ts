import Constants from '../../../common/constants';
import type { WorkflowParameter } from '../../../common/models/workflow';
import { convertWorkflowParameterTypeToSwaggerType } from '../../utils/tokens';
import { validateType } from '../../utils/validation';
import { getIntl } from '@microsoft-logic-apps/intl';
import { equals, guid } from '@microsoft-logic-apps/utils';
import type { WorkflowParameterUpdateEvent } from '@microsoft/designer-ui';
import { UIConstants } from '@microsoft/designer-ui';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface WorkflowParameterDefinition extends WorkflowParameter {
  name: string;
  isEditable: boolean;
}

export interface WorkflowParametersState {
  definitions: Record<string, WorkflowParameterDefinition>;
  validationErrors: Record<string, Record<string, string | undefined>>;
}

export const initialState: WorkflowParametersState = {
  definitions: {},
  validationErrors: {},
};

export const validateParameter = (
  id: string,
  data: { name?: string; type?: string; value?: string },
  keyToValidate: string,
  allDefinitions: Record<string, WorkflowParameterDefinition>
): string | undefined => {
  const intl = getIntl();
  if (equals(keyToValidate, 'name')) {
    const { name } = data;
    if (!name) {
      return intl.formatMessage({
        defaultMessage: 'Must provide name of parameter.',
        description: 'Error message when the workflow parameter name is empty.',
      });
    }

    const duplicateParameters = Object.keys(allDefinitions).filter(
      (parameterId) => parameterId !== id && equals(allDefinitions[parameterId].name, name)
    );

    return duplicateParameters.length > 0
      ? intl.formatMessage({
          defaultMessage: 'Parameter name already exists.',
          description: 'Error message when the workflow parameter name already exists.',
        })
      : undefined;
  } else if (equals(keyToValidate, 'value')) {
    const { type, value } = data;
    if (value === '' || value === undefined) {
      return intl.formatMessage({
        defaultMessage: 'Must provide value for parameter.',
        description: 'Error message when the workflow parameter value is empty.',
      });
    }

    const swaggerType = convertWorkflowParameterTypeToSwaggerType(type);
    let error = validateType(swaggerType, /* parameterFormat */ '', value);

    if (!error) {
      switch (swaggerType) {
        case Constants.SWAGGER.TYPE.ARRAY:
          // eslint-disable-next-line no-case-declarations
          let isInvalid = false;
          try {
            isInvalid = value !== undefined && value !== '' ? !Array.isArray(JSON.parse(value)) : false;
          } catch {
            isInvalid = true;
          }

          error = isInvalid
            ? intl.formatMessage({ defaultMessage: 'Enter a valid array.', description: 'Error validation message' })
            : undefined;
          break;

        case Constants.SWAGGER.TYPE.OBJECT:
        case Constants.SWAGGER.TYPE.BOOLEAN:
          try {
            if (value !== undefined && value !== '') {
              JSON.parse(value);
            }
          } catch {
            error =
              swaggerType === Constants.SWAGGER.TYPE.BOOLEAN
                ? intl.formatMessage({ defaultMessage: 'Enter a valid boolean.', description: 'Error validation message' })
                : intl.formatMessage({ defaultMessage: 'Enter a valid json.', description: 'Error validation message' });
          }
          break;

        default:
          break;
      }
    }

    return error;
  }

  return undefined;
};

export const workflowParametersSlice = createSlice({
  name: 'workflowParameters',
  initialState,
  reducers: {
    initializeParameters: (state, action: PayloadAction<Record<string, WorkflowParameterDefinition>>) => {
      state.definitions = action.payload;
    },
    addParameter: (state) => {
      const parameterId = guid();
      state.definitions[parameterId] = { isEditable: true, type: UIConstants.WORKFLOW_PARAMETER_SERIALIZED_TYPE.ARRAY, name: '' };
      state.validationErrors[parameterId] = {};
    },
    deleteParameter: (state, action: PayloadAction<string>) => {
      const parameterId = action.payload;
      delete state.validationErrors[parameterId];
      delete state.definitions[parameterId];
    },
    updateParameter: (state, action: PayloadAction<WorkflowParameterUpdateEvent>) => {
      const {
        id,
        newDefinition: { name, type, value },
      } = action.payload;
      const validationErrors = {
        name: validateParameter(id, { name }, 'name', state.definitions),
        value: validateParameter(id, { name, type, value }, 'value', state.definitions),
      };

      state.definitions[id] = { ...state.definitions[id], type, value, name: name ?? '' };
      state.validationErrors[id] = {
        ...state.validationErrors[id],
        ...validationErrors,
      };
    },
  },
});

export const { initializeParameters, addParameter, deleteParameter, updateParameter } = workflowParametersSlice.actions;

export default workflowParametersSlice.reducer;