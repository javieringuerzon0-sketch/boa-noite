import { Link, type LinkProps } from 'react-router-dom';

/**
 * Drop-in replacement for react-router Link.
 * Always scrolls to the top of the page instantly on click.
 * Use the regular <Link> or <a href="#..."> for hash anchors (e.g. #ubicacion).
 */
export function ScrollLink({ onClick, ...props }: LinkProps) {
  return (
    <Link
      {...props}
      onClick={e => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        onClick?.(e);
      }}
    />
  );
}
