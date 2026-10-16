import type { HTMLAttributes, ReactNode } from 'react';

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
  onPress: () => void;
  children: ReactNode;
}

/**
 * A block-level pressable surface (cards, rows) that keeps valid HTML and
 * keyboard support while getting the shared `:active` scale feedback.
 */
export function Pressable({ onPress, className = '', children, ...rest }: Props) {
  return (
    <div
      role="button"
      tabIndex={0}
      className={`pressable ${className}`}
      onClick={onPress}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPress();
        }
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
