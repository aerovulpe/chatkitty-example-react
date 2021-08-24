import React, { useContext } from 'react';

import { ChatAppContext } from '../providers/ChatAppProvider';
import {
  FlexRow,
  Icon,
  Icons,
  Label,
  LabelVariants,
  StyledBox,
} from '../ui-kit/components';

const CurrentUserStatus: React.FC = () => {
  const { currentUser, online } = useContext(ChatAppContext);

  return (
    <FlexRow>
      <Label variant={LabelVariants.INVERSE}>{currentUser?.displayName}</Label>

      <StyledBox marginLeft={1}>
        <Icon
          icon={Icons.Presence}
          title={online ? 'Connected' : 'Not connected'}
          color={online ? 'success' : 'inactive'}
        />
      </StyledBox>
    </FlexRow>
  );
};

export default CurrentUserStatus;
