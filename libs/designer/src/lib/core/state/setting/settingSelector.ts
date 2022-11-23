import type { RootState } from '../../store';
import { useSelector } from 'react-redux';

export const useSettingValidationErrors = (nodeId: string) => {
  return useSelector((rootState: RootState) => rootState.settings.validationErrors?.[nodeId] ?? []);
};