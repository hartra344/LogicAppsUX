import type { MenuItemOption } from '../card/types';
import { MenuItemType } from '../card/types';
import type { PageActionTelemetryData } from '../telemetry/models';
import type { PanelTab } from './panelUtil';
import { registerTab, getTabs } from './panelUtil';
import { PanelContainer } from './panelcontainer';
import { PanelHeaderControlType } from './panelheader/panelheader';
import { monitorRetryTab, monitorRequestTab, aboutTab } from './registeredtabs';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

export interface PanelRootProps {
  cardIcon?: string;
  comment?: string;
  isRecommendation: boolean;
  noNodeSelected: boolean;
  selectedTabId?: string;
  readOnlyMode?: boolean;
  title: string;
}

export const PanelRoot = ({
  cardIcon,
  comment,
  isRecommendation,
  noNodeSelected,
  selectedTabId,
  readOnlyMode,
  title,
}: PanelRootProps): JSX.Element => {
  const intl = useIntl();

  const [showCommentBox, setShowCommentBox] = useState(Boolean(comment));
  const [currentComment, setCurrentComment] = useState(comment);
  const [selectedTab, setSelectedTab] = useState(selectedTabId);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [width, setWidth] = useState('auto');

  const [registeredTabs, setRegisteredTabs] = useState<Record<string, PanelTab>>({});

  useEffect(() => {
    setRegisteredTabs((currentTabs) => registerTab(aboutTab, registerTab(monitorRetryTab, registerTab(monitorRequestTab, currentTabs))));
  }, []);

  useEffect(() => {
    setSelectedTab(getTabs(true, registeredTabs)[0]?.name.toLowerCase());
  }, [registeredTabs]);

  useEffect(() => {
    isCollapsed ? setWidth('auto') : setWidth('630px');
  }, [isCollapsed]);

  const getPanelHeaderControlType = (): boolean => {
    // TODO: 13067650
    return isRecommendation;
  };

  const getPanelHeaderMenu = (): MenuItemOption[] => {
    const menuOptions: MenuItemOption[] = [];
    // TODO: 13067650 Conditionals to decide when to show these menu options
    getCommentMenuItem(menuOptions);
    getDeleteMenuItem(menuOptions);
    return menuOptions;
  };

  const getCommentMenuItem = (options: MenuItemOption[]): MenuItemOption[] => {
    const commentDescription = intl.formatMessage({
      defaultMessage: 'Comment',
      description: 'Comment text',
    });
    const disabledCommentAction = intl.formatMessage({
      defaultMessage: 'Comments can only be added while editing the inputs of a step.',
      description: 'Text to tell users why a comment is disabled',
    });
    const commentAdd = intl.formatMessage({
      defaultMessage: 'Add a comment',
      description: 'Text to tell users to click to add comments',
    });
    const commentDelete = intl.formatMessage({
      defaultMessage: 'Delete comment',
      description: 'Text to tell users to click to delete comments',
    });

    options.push({
      disabled: readOnlyMode,
      type: MenuItemType.Advanced,
      disabledReason: disabledCommentAction,
      iconName: 'Comment',
      key: commentDescription,
      title: showCommentBox ? commentDelete : commentAdd,
      onClick: handleCommentMenuClick,
    });
    return options;
  };

  const getDeleteMenuItem = (options: MenuItemOption[]): MenuItemOption[] => {
    const deleteDescription = intl.formatMessage({
      defaultMessage: 'Delete',
      description: 'Delete text',
    });
    // TODO: 13067650 Disabled reason/description tobe implemented when panel actions gets built
    const canDelete = true;
    const disabledDeleteAction = intl.formatMessage({
      defaultMessage: 'This operation has already been deleted.',
      description: 'Text to tell users why delete is disabled',
    });

    options.push({
      key: deleteDescription,
      disabled: readOnlyMode || !canDelete,
      disabledReason: disabledDeleteAction,
      iconName: 'Delete',
      title: deleteDescription,
      type: MenuItemType.Advanced,
      onClick: handleDelete,
    });
    return options;
  };

  const handleCommentMenuClick = (_: React.MouseEvent<HTMLElement>): void => {
    if (currentComment != null) {
      setCurrentComment(undefined);
      setShowCommentBox(false);
    } else {
      setCurrentComment('');
      setShowCommentBox(true);
    }
  };

  // TODO: 12798945? onClick for delete when node store gets built
  const handleDelete = (): void => {
    // TODO: 12798935 Analytics (event logging)
    console.log('Node deleted!');
  };

  return (
    <PanelContainer
      cardIcon={cardIcon}
      comment={currentComment}
      isRight
      isCollapsed={isCollapsed}
      noNodeSelected={noNodeSelected}
      panelHeaderControlType={getPanelHeaderControlType() ? PanelHeaderControlType.DISMISS_BUTTON : PanelHeaderControlType.MENU}
      panelHeaderMenu={getPanelHeaderMenu()}
      selectedTab={selectedTab}
      showCommentBox={showCommentBox}
      tabs={registeredTabs}
      width={width}
      onDismissButtonClicked={handleDelete}
      setSelectedTab={setSelectedTab}
      setIsCollapsed={setIsCollapsed}
      trackEvent={handleTrackEvent}
      title={title}
    />
  );
};

// TODO: 12798935 Analytics (event logging)
const handleTrackEvent = (data: PageActionTelemetryData): void => {
  console.log('Track Event');
};