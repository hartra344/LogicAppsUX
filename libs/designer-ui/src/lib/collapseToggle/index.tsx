import { TooltipHost, DirectionalHint, Icon } from '@fluentui/react';
import { FontSizes } from '@fluentui/theme';
import { useIntl } from 'react-intl';

interface CollapseToggleProps {
  collapsed?: boolean;
  handleCollapse?: (event: { currentTarget: any }) => void;
}

const CollapseToggle = (props: CollapseToggleProps) => {
  const { collapsed = false, handleCollapse } = props;

  const intl = useIntl();
  const EXPAND_TEXT = intl.formatMessage({
    defaultMessage: 'Expand',
    description: 'Expand, making the node bigger, showing the contents',
  });

  const COLLAPSE_TEXT = intl.formatMessage({
    defaultMessage: 'Collapse',
    description: 'Collapse, making the node smaller, hiding the contents',
  });

  const iconName = collapsed ? 'ChevronDown' : 'ChevronUp';
  const toggleText = collapsed ? EXPAND_TEXT : COLLAPSE_TEXT;

  return (
    <TooltipHost content={toggleText} directionalHint={DirectionalHint.rightCenter}>
      <button aria-label={toggleText} className="msla-collapse-toggle" onClick={handleCollapse}>
        <Icon iconName={iconName} styles={{ root: { fontSize: FontSizes.small } }} />
      </button>
    </TooltipHost>
  );
};

export default CollapseToggle;