import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';

import { useMediaQuery } from '../../../hooks';
import useHover from '../../../hooks/useHover';
import { getUniqueColor } from '../../../utilities';
import { ListItem } from '../../layout';
import { Icon, Icons, LabelVariants, Title } from '../../presentation';
import { Avatar } from '../avatar/avatar';
import { ImageAvatar } from '../avatar/image-avatar';

interface DetailedChannelViewProps {
  selected: boolean;
  id: number;
  name: string;
  displayPicture?: string;
  unreadMessageCount: number;
  onClick: () => void;
  onLeave: () => void;
}

/**
 * Show a single joined channel
 */
const DetailedChannelView: React.FC<DetailedChannelViewProps> = ({
  selected,
  id,
  name,
  displayPicture,
  onClick,
  onLeave,
  unreadMessageCount,
}: DetailedChannelViewProps) => {
  const [isHovering, hoverProps] = useHover({ mouseEnterDelayMS: 0 });
  const theme = useContext(ThemeContext);
  const isTouch = useMediaQuery(theme.mediaQueries.touch);
  const color = getUniqueColor(
    name,
    theme.colors.avatars as unknown as string[]
  );

  return (
    <ListItem
      key={id}
      onClick={onClick}
      bg={
        selected
          ? theme.backgrounds.primaryActive
          : isHovering
          ? theme.backgrounds.primaryHover
          : 'transparent'
      }
      {...hoverProps}
      clickable
    >
      {displayPicture ? (
        <ImageAvatar image={displayPicture} />
      ) : (
        <Avatar bg={color} color={theme.colors.selectedText}>
          #
        </Avatar>
      )}
      <Title
        label={name}
        labelProps={{
          variant: LabelVariants.INVERSE,
          bold: unreadMessageCount > 0,
        }}
      ></Title>

      {(isHovering || isTouch) && (
        <Icon
          icon={Icons.Leave}
          color="onPrimary"
          title="Leave Channel"
          onClick={(e) => {
            e.stopPropagation();
            onLeave();
          }}
        />
      )}
    </ListItem>
  );
};

export { DetailedChannelView };
