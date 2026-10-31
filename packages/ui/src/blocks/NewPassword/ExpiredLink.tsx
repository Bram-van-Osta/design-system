import { Link, type LinkProps } from '../../components/Link/Link.tsx';
import { useMessages } from '../../i18n/use-messages.ts';
import { AuthBlock } from '../shared/AuthBlock.tsx';

interface ExpiredLinkProps {
  /** The app's link to the forgotten password, where a new link is asked for. */
  readonly forgotPasswordLink: Omit<LinkProps, 'children'> | undefined;
  readonly className: string | undefined;
}

/** A link from a mail that was already used, or expired, and the way to get a new one. */
export function ExpiredLink({ forgotPasswordLink, className }: ExpiredLinkProps) {
  const messages = useMessages();
  return (
    <AuthBlock
      kicker={messages['expiredLink.kicker']}
      heading={messages['expiredLink.heading']}
      lead={messages['expiredLink.lead']}
      className={className}
    >
      {forgotPasswordLink && (
        <Link {...forgotPasswordLink} className="self-start">
          {messages['expiredLink.action']}
        </Link>
      )}
    </AuthBlock>
  );
}
