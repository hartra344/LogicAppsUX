import type { Settings } from '../../core/actions/bjsworkflow/settings';
import { useAllOperations, useIconUri, useOperationInfo } from '../../core/state/selectors/actionMetadataSelector';
import type { RootState } from '../../core/store';
import { DataHandling } from './sections/datahandling';
import { General } from './sections/general';
import { Networking } from './sections/networking';
import type { runAfterConfigs } from './sections/runafter';
import { RunAfter } from './sections/runafter';
import { Security } from './sections/security';
import { Tracking } from './sections/tracking';
import { useSelector } from 'react-redux';

export interface SectionProps extends Settings {
  readOnly: boolean | undefined;
  nodeId: string;
}

export const SettingsPanel = (): JSX.Element => {
  const nodeId = useSelector((state: RootState) => {
    return state.panel.selectedNode;
  });
  const {
    secureInputs,
    secureOutputs,
    asynchronous,
    disableAsyncPattern,
    disableAutomaticDecompression,
    suppressWorkflowHeaders,
    suppressWorkflowHeadersOnResponse,
    requestOptions,
    requestSchemaValidation,
    retryPolicy,
    timeout,
    trackedProperties,
    uploadChunk,
    splitOn,
    // splitOnConfiguration,
    paging,
    downloadChunkSize,
    concurrency,
    conditionExpressions,
    correlation,
    runAfter,
  } = useSelector((state: RootState) => {
    return state.operations.settings[nodeId] ?? {};
  });

  // TODO: 14714481 We need to support all incoming edges (currently using all edges) and runAfterConfigMenu
  const incomingEdges = useAllOperations();
  const allEdges: Record<string, runAfterConfigs> = {};
  for (const key in incomingEdges) {
    allEdges[key] = GetEdgeInfo(key);
  }

  const renderGeneral = (): JSX.Element | null => {
    const generalSectionProps: SectionProps = {
      splitOn,
      timeout,
      concurrency,
      conditionExpressions,
      readOnly: false,
      nodeId,
    };
    if (splitOn?.isSupported || timeout?.isSupported || concurrency?.isSupported || conditionExpressions?.isSupported) {
      return <General {...generalSectionProps} />;
    } else return null;
  };

  const renderDataHandling = (): JSX.Element | null => {
    const dataHandlingProps: SectionProps = {
      requestSchemaValidation,
      disableAutomaticDecompression,
      readOnly: false,
      nodeId,
    };
    if (requestSchemaValidation?.isSupported || disableAutomaticDecompression?.isSupported) {
      return <DataHandling {...dataHandlingProps} />;
    } else return null;
  };

  const renderNetworking = (): JSX.Element | null => {
    const networkingProps: SectionProps = {
      readOnly: false,
      nodeId,
      retryPolicy,
      suppressWorkflowHeaders,
      suppressWorkflowHeadersOnResponse,
      paging,
      uploadChunk,
      downloadChunkSize,
      asynchronous,
      disableAsyncPattern,
      requestOptions,
    };
    if (
      retryPolicy?.isSupported ||
      suppressWorkflowHeaders?.isSupported ||
      suppressWorkflowHeadersOnResponse?.isSupported ||
      paging?.isSupported ||
      uploadChunk?.isSupported ||
      downloadChunkSize?.isSupported ||
      asynchronous?.isSupported ||
      disableAsyncPattern?.isSupported ||
      requestOptions?.isSupported
    ) {
      return <Networking {...networkingProps} />;
    } else return null;
  };

  const renderRunAfter = (): JSX.Element | null => {
    const runAfterProps: SectionProps = {
      readOnly: false,
      nodeId,
      runAfter,
    };
    return runAfter?.isSupported ? <RunAfter allEdges={allEdges} {...runAfterProps} /> : null;
  };

  const renderSecurity = (): JSX.Element | null => {
    const securitySectionProps: SectionProps = {
      secureInputs,
      secureOutputs,
      readOnly: false,
      nodeId,
    };
    return secureInputs?.isSupported || secureOutputs?.isSupported ? <Security {...securitySectionProps} /> : null;
  };

  const renderTracking = (): JSX.Element | null => {
    const trackingProps: SectionProps = {
      readOnly: false,
      nodeId,
      trackedProperties,
      correlation, //correlation setting contains trackingId setting being used in this component
    };
    if (trackedProperties?.isSupported || correlation?.isSupported) {
      return <Tracking {...trackingProps} />;
    } else return null;
  };

  const renderAllSettingsSections = (): JSX.Element => {
    return (
      <>
        {renderDataHandling()}
        {renderGeneral()}
        {renderNetworking()}
        {renderRunAfter()}
        {renderSecurity()}
        {renderTracking()}
      </>
    );
  };

  return renderAllSettingsSections();
};

const GetEdgeInfo = (id: string): runAfterConfigs => {
  const operationInfo = useOperationInfo(id);
  const iconUri = useIconUri(operationInfo);
  return { icon: iconUri, title: id };
};