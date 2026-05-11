import { useEffect, useRef } from 'react';
import { Clear, Bell } from '@procore/core-icons';
import styled from 'styled-components';

interface NotificationSlideoutProps {
  open: boolean;
  onClose: () => void;
}

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    title: 'M. Stegner updated this submittal. Ball is in your court.',
    item: 'Submittal S 22-0500',
    project: '093487 - Cottage Hospital',
    time: '2 hours ago',
    unread: true,
  },
  {
    id: '2',
    title: 'P. Gomez updated this submittal. Ball is in your court.',
    item: 'Submittal S 22-0500',
    project: '093487 - Cottage Hospital',
    time: '2 hours ago',
    unread: true,
  },
  {
    id: '3',
    title: 'New RFI response received.',
    item: 'RFI-042 Structural Detail',
    project: 'Burnham Park Data Center',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: '4',
    title: 'Budget updated by Finance team.',
    item: 'Budget v3.2',
    project: 'Gateway Office Complex',
    time: '2 days ago',
    unread: false,
  },
];

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 40;
  background: rgba(0, 0, 0, 0.2);
`;

const Panel = styled.div`
  position: fixed;
  right: 0;
  top: 52px;
  z-index: 50;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 52px);
  width: 420px;
  max-width: 100%;
  background: #ffffff;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
  border-left: 1px solid #e5e7eb;
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e5e7eb;
  padding: 12px 16px;
`;

const PanelTitle = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
`;

const CloseBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 4px;
  color: #6b7280;
  cursor: pointer;
  svg {
    width: 16px;
    height: 16px;
  }
  &:hover {
    background: #f3f4f6;
  }
`;

const NotifList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 64px 16px;
  color: #9ca3af;
  svg {
    width: 40px;
    height: 40px;
  }
`;

const NotifItem = styled.div<{ $unread: boolean }>`
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  background: ${({ $unread }) =>
    $unread ? 'rgba(255, 82, 0, 0.04)' : 'transparent'};
  border-bottom: 1px solid #f3f4f6;
  &:hover {
    background: #f9fafb;
  }
`;

const UnreadDot = styled.span`
  margin-top: 6px;
  width: 8px;
  height: 8px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #ff5200;
`;

const PlaceholderDot = styled.span`
  margin-top: 6px;
  width: 8px;
  height: 8px;
  flex-shrink: 0;
`;

const NotifContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const PanelFooter = styled.div`
  border-top: 1px solid #e5e7eb;
  padding: 12px 16px;
`;

export function NotificationSlideout({
  open,
  onClose,
}: NotificationSlideoutProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <Backdrop onClick={onClose} aria-hidden />
      <Panel ref={panelRef} role="dialog" aria-label="Notifications">
        <PanelHeader>
          <PanelTitle>Notifications</PanelTitle>
          <CloseBtn
            type="button"
            onClick={onClose}
            aria-label="Close notifications"
          >
            <Clear />
          </CloseBtn>
        </PanelHeader>

        <NotifList>
          {MOCK_NOTIFICATIONS.length === 0 ? (
            <EmptyState>
              <Bell />
              <p style={{ margin: 0, fontSize: 14, color: '#6b7280' }}>
                No notifications
              </p>
            </EmptyState>
          ) : (
            MOCK_NOTIFICATIONS.map((notif) => (
              <NotifItem key={notif.id} $unread={notif.unread}>
                {notif.unread ? (
                  <UnreadDot aria-hidden />
                ) : (
                  <PlaceholderDot aria-hidden />
                )}
                <NotifContent>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      color: '#111827',
                      lineHeight: 1.4,
                    }}
                  >
                    {notif.title}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      color: '#6b7280',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {notif.item}
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: '#9ca3af' }}>
                    {notif.project} · {notif.time}
                  </p>
                </NotifContent>
              </NotifItem>
            ))
          )}
        </NotifList>

        <PanelFooter>
          <button
            type="button"
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              padding: 0,
              font: 'inherit',
              fontSize: 14,
              textAlign: 'center',
              color: '#1d5cc9',
              cursor: 'pointer',
            }}
          >
            View all notifications
          </button>
        </PanelFooter>
      </Panel>
    </>
  );
}
