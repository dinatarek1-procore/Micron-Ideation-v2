import { useState, useRef, type ReactNode } from 'react';
import { Person, Cog, ArrowRight, Clear } from '@procore/core-icons';
import { Box, Popover, Avatar } from '@procore/core-react';
import styled from 'styled-components';

interface OverlayTriggerRef {
  show: () => void;
  hide: () => void;
}

export interface ProfileData {
  image?: string;
  name: string;
  email: string;
  role: string;
}

interface ProfilePopoverProps {
  trigger: ReactNode;
  initialData?: ProfileData;
  onSave?: (data: ProfileData) => void;
}

const DropdownPanel = styled.div`
  width: 280px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #111827;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -4px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
  padding: 6px;
`;

const IdentityRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  margin-bottom: 4px;
`;

const Divider = styled.div`
  border-top: 1px solid #f3f4f6;
  margin: 4px 0;
`;

const MenuItem = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 10px;
  border: none;
  border-radius: 8px;
  background: transparent;
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  color: ${({ $danger }) => ($danger ? '#dc2626' : '#111827')};
  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    color: ${({ $danger }) => ($danger ? '#dc2626' : '#6b7280')};
  }
  &:hover {
    background: #f8fafc;
  }
`;

const ChevronRight = styled.span`
  margin-left: auto;
  svg {
    width: 16px;
    height: 16px;
    color: #9ca3af;
  }
`;

const EditHeader = styled.div`
  padding: 8px 10px;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 8px;
`;

const EditBody = styled.div`
  padding: 0 10px 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FieldLabel = styled.label`
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
`;

const TextInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 6px 12px;
  font: inherit;
  font-size: 14px;
  color: #111827;
  outline: none;
  &:focus {
    border-color: var(--color-border-input-focus, #4c85e6);
    box-shadow: 0 0 0 2px rgba(76, 133, 230, 0.15);
  }
`;

const EditActions = styled.div`
  display: flex;
  gap: 8px;
  padding-top: 4px;
`;

const ActionBtn = styled.button<{ $primary?: boolean }>`
  flex: 1;
  border: ${({ $primary }) => ($primary ? 'none' : '1px solid #e5e7eb')};
  border-radius: 6px;
  background: ${({ $primary }) =>
    $primary ? 'var(--color-brand-500, #ff5200)' : '#ffffff'};
  padding: 6px;
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  color: ${({ $primary }) => ($primary ? '#ffffff' : '#374151')};
  cursor: pointer;
  &:hover {
    opacity: 0.85;
  }
`;

export function ProfilePopover({
  trigger,
  initialData,
  onSave,
}: ProfilePopoverProps) {
  const overlayRef = useRef<OverlayTriggerRef>(null);
  const [panel, setPanel] = useState<'menu' | 'edit'>('menu');
  const [name, setName] = useState(initialData?.name ?? '');
  const [email, setEmail] = useState(initialData?.email ?? '');
  const [role, setRole] = useState(initialData?.role ?? '');

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleSave = () => {
    onSave?.({ name, email, role, image: initialData?.image });
    setPanel('menu');
  };

  const handleClose = () => {
    setPanel('menu');
    overlayRef.current?.hide();
  };

  const panelContent = (
    <DropdownPanel>
      {panel === 'menu' ? (
        <>
          <IdentityRow>
            <Avatar size="md" aria-label={name || 'User'}>
              {initialData?.image ? (
                <Avatar.Portrait imageUrl={initialData.image} />
              ) : (
                <Avatar.Label>{initials || '?'}</Avatar.Label>
              )}
            </Avatar>
            <Box
              style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}
            >
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#111827',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {name || 'Account'}
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: '#9ca3af',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {email}
              </span>
            </Box>
          </IdentityRow>

          <Divider />

          <MenuItem type="button" onClick={() => setPanel('edit')}>
            <Person aria-hidden />
            <span>Edit Profile</span>
            <ChevronRight>
              <ArrowRight />
            </ChevronRight>
          </MenuItem>
          <MenuItem type="button">
            <Cog aria-hidden />
            <span>Settings</span>
          </MenuItem>

          <Divider />

          <MenuItem type="button" $danger onClick={handleClose}>
            <Clear aria-hidden />
            <span>Sign Out</span>
          </MenuItem>
        </>
      ) : (
        <>
          <EditHeader>
            <h3
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 600,
                color: '#111827',
              }}
            >
              Edit Profile
            </h3>
          </EditHeader>
          <EditBody>
            <FieldGroup>
              <FieldLabel>Name</FieldLabel>
              <TextInput
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FieldGroup>
            <FieldGroup>
              <FieldLabel>Email</FieldLabel>
              <TextInput
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FieldGroup>
            <FieldGroup>
              <FieldLabel>Role</FieldLabel>
              <TextInput
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </FieldGroup>
            <EditActions>
              <ActionBtn type="button" onClick={() => setPanel('menu')}>
                Cancel
              </ActionBtn>
              <ActionBtn type="button" $primary onClick={handleSave}>
                Save
              </ActionBtn>
            </EditActions>
          </EditBody>
        </>
      )}
    </DropdownPanel>
  );

  return (
    <Popover
      overlay={
        <Popover.Content placement="bottom-right">
          {panelContent}
        </Popover.Content>
      }
      placement="bottom-right"
      trigger="click"
      overlayRef={overlayRef}
      beforeHide={() => {
        setPanel('menu');
      }}
    >
      {trigger as React.ReactElement}
    </Popover>
  );
}
