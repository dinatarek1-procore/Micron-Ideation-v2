import { useState, useEffect, useRef } from 'react';
import { Clear, Check } from '@procore/core-icons';
import styled from 'styled-components';

interface CompanyEditSlideoutProps {
  open: boolean;
  onClose: () => void;
  currentCompanyId?: string;
}

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

const PanelBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FieldLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
`;

const TextInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 8px 12px;
  font: inherit;
  font-size: 14px;
  color: #111827;
  outline: none;
  &:focus {
    border-color: var(--color-border-input-focus, #4c85e6);
    box-shadow: 0 0 0 2px rgba(76, 133, 230, 0.15);
  }
`;

const LogoUploadArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 96px;
  width: 100%;
  border-radius: 8px;
  border: 2px dashed #e5e7eb;
  cursor: pointer;
  overflow: hidden;
  &:hover {
    border-color: #9ca3af;
  }
`;

const PanelFooter = styled.div`
  border-top: 1px solid #e5e7eb;
  padding: 12px 16px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const CancelBtn = styled.button`
  border: 1px solid #e5e7eb;
  background: #ffffff;
  border-radius: 6px;
  padding: 8px 16px;
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  &:hover {
    background: #f9fafb;
  }
`;

const SaveBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: var(--color-brand-500, #ff5200);
  border-radius: 6px;
  padding: 8px 16px;
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  cursor: pointer;
  svg {
    width: 16px;
    height: 16px;
  }
  &:hover {
    background: #e64900;
  }
`;

export function CompanyEditSlideout({
  open,
  onClose,
}: CompanyEditSlideoutProps) {
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [officeName, setOfficeName] = useState('Miller Design HQ');
  const [address, setAddress] = useState('1234 Commerce Drive, Suite 400');

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!saved) return;
    const t = window.setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
    return () => clearTimeout(t);
  }, [saved, onClose]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogo(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  if (!open) return null;

  return (
    <>
      <Backdrop onClick={onClose} aria-hidden />
      <Panel role="dialog" aria-label="Edit company branding">
        <PanelHeader>
          <h2
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 600,
              color: '#111827',
            }}
          >
            Edit Company Branding
          </h2>
          <CloseBtn type="button" onClick={onClose}>
            <Clear />
          </CloseBtn>
        </PanelHeader>

        <PanelBody>
          <FieldGroup>
            <FieldLabel>Company Logo</FieldLabel>
            <LogoUploadArea onClick={() => fileInputRef.current?.click()}>
              {logo ? (
                <img
                  src={logo}
                  alt="Company logo"
                  style={{
                    height: '100%',
                    width: '100%',
                    objectFit: 'contain',
                  }}
                />
              ) : (
                <span style={{ fontSize: 14, color: '#9ca3af' }}>
                  Click to upload logo
                </span>
              )}
            </LogoUploadArea>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleLogoUpload}
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Office Name</FieldLabel>
            <TextInput
              type="text"
              value={officeName}
              onChange={(e) => setOfficeName(e.target.value)}
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Address</FieldLabel>
            <TextInput
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </FieldGroup>
        </PanelBody>

        <PanelFooter>
          <CancelBtn type="button" onClick={onClose}>
            Cancel
          </CancelBtn>
          <SaveBtn type="button" onClick={() => setSaved(true)}>
            {saved && <Check />}
            {saved ? 'Saved!' : 'Save Changes'}
          </SaveBtn>
        </PanelFooter>
      </Panel>
    </>
  );
}
