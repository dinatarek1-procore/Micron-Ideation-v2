interface PickerCaretProps {
  open: boolean;
  className?: string;
}

export function PickerCaret({ open }: PickerCaretProps) {
  return (
    <svg
      style={{
        width: 16,
        height: 16,
        flexShrink: 0,
        color: 'rgba(255,255,255,0.7)',
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.3s ease-out',
      }}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M7 10l5 5 5-5z" />
    </svg>
  );
}
