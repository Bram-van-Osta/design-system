import type { ComponentProps } from 'react';

/** What an app's router gives: a link that takes a `to` and renders an <a>, marked for the tests. */
export function RouterLink({ to, ...props }: ComponentProps<'a'> & { readonly to: string }) {
  return <a {...props} href={to} data-router-link="" />;
}
