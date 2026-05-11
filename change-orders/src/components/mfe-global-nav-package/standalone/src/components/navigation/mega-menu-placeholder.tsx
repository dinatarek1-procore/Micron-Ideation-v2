import {
  normalizeUrlPath,
  shellNavigate,
  useShellPathname,
} from '../../lib/prototypeToolPaths';
import { Star } from '@procore/core-icons';
import styled from 'styled-components';
import type {
  MegaMenuColumn,
  MegaMenuLink,
  MegaMenuBlock,
} from '../../lib/tool-menu-placeholders';

const HEADER_TITLE_CLASS_STYLES = `
  white-space: nowrap;
  padding-bottom: 8px;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: 0.15px;
`;

const MenuRoot = styled.div<{ $light: boolean }>`
  box-sizing: border-box;
  display: flex;
  width: 100vw;
  max-width: 100vw;
  justify-content: center;
  padding-top: 44px;
  padding-bottom: 56px;
  background: ${({ $light }) => ($light ? '#ffffff' : '#232729')};
  color: ${({ $light }) => ($light ? '#232729' : '#ffffff')};
`;

const Gutter = styled.div`
  display: none;
  flex: 1;
  min-width: 24px;
  max-width: 144px;
  @media (min-width: 640px) {
    display: block;
  }
`;

const ColumnsContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 1648px;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 40px 40px;
  padding: 0 16px;
  @media (min-width: 1024px) {
    flex-wrap: nowrap;
    gap: 40px 48px;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  flex: 1;
  min-width: 200px;
  @media (min-width: 1024px) {
    min-width: 0;
    max-width: min(360px, 28%);
  }
`;

const BlockRoot = styled.div`
  min-width: 0;
`;

const SectionHeaderRow = styled.div<{ $wide?: boolean }>`
  display: flex;
  align-items: flex-end;
  width: 100%;
  min-width: 0;
  margin-bottom: 8px;
  max-width: ${({ $wide }) => ($wide ? 'none' : '248px')};
`;

const SectionTitle = styled.span<{ $light: boolean }>`
  ${HEADER_TITLE_CLASS_STYLES}
  flex: 1;
  min-width: 0;
  border-bottom: 1px solid
    ${({ $light }) => ($light ? '#dfdfde' : 'rgba(255,255,255,0.25)')};
  color: ${({ $light }) => ($light ? '#232729' : '#ffffff')};
`;

const StarGutter = styled.div`
  position: relative;
  display: flex;
  width: 16px;
  flex-shrink: 0;
  justify-content: center;
  padding-bottom: 8px;
`;

const LinkRow = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  width: 100%;
  min-width: 0;
  max-width: 248px;
  margin-bottom: 8px;
`;

const LinkBtn = styled.button<{
  $active: boolean;
  $light: boolean;
  $disabled?: boolean;
}>`
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  padding: 0;
  text-align: left;
  font: inherit;
  font-size: 14px;
  line-height: 1.4;
  letter-spacing: 0.25px;
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
  color: ${({ $active, $light }) =>
    $light
      ? $active
        ? '#232729'
        : '#707070'
      : $active
        ? '#ffffff'
        : '#acb5b9'};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  &:hover {
    color: ${({ $light, $disabled }) =>
      $disabled ? undefined : $light ? '#232729' : '#ffffff'};
  }
`;

const SingleCol = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const SplitRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0 32px;
  min-width: 0;
`;

const SplitCol = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: min(100%, 200px);
`;

function linkIsActive(pathname: string, href: string): boolean {
  if (href === '#' || href === '') return false;
  const p = normalizeUrlPath(pathname);
  const h = normalizeUrlPath(href);
  return p === h || p.startsWith(`${h}/`);
}

function MegaMenuLinkRow({
  link,
  light,
  pathname,
  onNavigate,
}: {
  link: MegaMenuLink;
  light: boolean;
  pathname: string;
  onNavigate: () => void;
}) {
  const active = linkIsActive(pathname, link.href);

  const handleClick = () => {
    if (link.href === '#') return;
    onNavigate();
    shellNavigate(link.href);
  };

  return (
    <LinkRow>
      {!light && (
        <StarGutter aria-hidden>
          {link.starred ? (
            <Star style={{ width: 16, height: 16, color: '#acb5b9' }} />
          ) : (
            <span style={{ display: 'inline-block', width: 16, height: 16 }} />
          )}
        </StarGutter>
      )}
      <LinkBtn
        type="button"
        $active={active}
        $light={light}
        $disabled={link.href === '#'}
        onClick={handleClick}
        style={{ marginLeft: !light ? 4 : 0 }}
      >
        <span style={{ wordBreak: 'break-word' }}>{link.label}</span>
      </LinkBtn>
    </LinkRow>
  );
}

function BlockContent({
  block,
  light,
  pathname,
  onNavigate,
}: {
  block: MegaMenuBlock;
  light: boolean;
  pathname: string;
  onNavigate: () => void;
}) {
  if (block.kind === 'single') {
    return (
      <SingleCol>
        {block.links.map((link) => (
          <MegaMenuLinkRow
            key={`${block.title}-${link.id}`}
            link={link}
            light={light}
            pathname={pathname}
            onNavigate={onNavigate}
          />
        ))}
      </SingleCol>
    );
  }

  return (
    <SplitRow>
      <SplitCol>
        {block.left.map((link) => (
          <MegaMenuLinkRow
            key={`${block.title}-L-${link.id}`}
            link={link}
            light={light}
            pathname={pathname}
            onNavigate={onNavigate}
          />
        ))}
      </SplitCol>
      <SplitCol>
        {block.right.map((link) => (
          <MegaMenuLinkRow
            key={`${block.title}-R-${link.id}`}
            link={link}
            light={light}
            pathname={pathname}
            onNavigate={onNavigate}
          />
        ))}
      </SplitCol>
    </SplitRow>
  );
}

function ColumnBlock({
  block,
  light,
  pathname,
  onNavigate,
}: {
  block: MegaMenuBlock;
  light: boolean;
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <BlockRoot>
      <SectionHeaderRow $wide={block.kind === 'split'}>
        {!light && <StarGutter aria-hidden />}
        <SectionTitle $light={light} style={{ marginLeft: !light ? 4 : 0 }}>
          {block.title}
        </SectionTitle>
      </SectionHeaderRow>
      <BlockContent
        block={block}
        light={light}
        pathname={pathname}
        onNavigate={onNavigate}
      />
    </BlockRoot>
  );
}

export function MegaMenuPlaceholder({
  columns,
  light,
  onClose,
  className,
}: {
  columns: MegaMenuColumn[];
  light: boolean;
  onClose?: () => void;
  className?: string;
}) {
  const pathname = useShellPathname();

  return (
    <MenuRoot data-header="picker-tools" $light={light} className={className}>
      <Gutter aria-hidden />
      <ColumnsContainer>
        {columns.map((col) => (
          <Column key={col.id}>
            {col.blocks.map((block, idx) => (
              <ColumnBlock
                key={`${col.id}-${block.kind}-${block.title}-${idx}`}
                block={block}
                light={light}
                pathname={pathname}
                onNavigate={() => onClose?.()}
              />
            ))}
          </Column>
        ))}
      </ColumnsContainer>
      <Gutter aria-hidden />
    </MenuRoot>
  );
}
