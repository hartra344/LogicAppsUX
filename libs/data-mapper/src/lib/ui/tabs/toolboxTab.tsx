import type { PanelTab } from '@microsoft/designer-ui';
import { About } from '@microsoft/designer-ui';

// TODO - All dummy content
const ToolboxTab = () => {
  const descriptionDocumentation = { url: 'www.microsoft.com', description: 'more info' };
  const headerIcons = [
    { title: 'Tag1', badgeText: 'test' },
    { title: 'Tag2', badgeText: 'more' },
  ];
  return (
    <About
      connectorDisplayName="Node Name"
      description="description "
      descriptionDocumentation={descriptionDocumentation}
      headerIcons={headerIcons}
    />
  );
};

export const toolboxTab: PanelTab = {
  title: 'Toolbox Title',
  name: 'Toolbox name',
  description: 'Toolbox description',
  enabled: true,
  content: <ToolboxTab />,
  order: 0,
  icon: 'Info',
};