import { ArrowRightIcon } from '@phosphor-icons/react';
import { type ReactNode, useId } from 'react';
import { Heading, HeadingSize } from '../../components/Heading/Heading.tsx';
import { Kicker } from '../../components/Kicker/Kicker.tsx';
import { Link, type LinkProps } from '../../components/Link/Link.tsx';
import { Tulip } from '../../components/Logo/Tulip.tsx';
import { Text, TextTone, TextVariant } from '../../components/Text/Text.tsx';
import { useMessages } from '../../i18n/use-messages.ts';
import { ICON_SIZE, ICON_WEIGHT } from '../../utils/icon.ts';
import { BrandBar } from '../shared/BrandBar.tsx';

// The large tulip, as round 7 draws it on a phone and on a computer.
const TULIP_SIZE_ON_PHONE = 72;
const TULIP_SIZE_ON_COMPUTER = 104;

/** A line of what the operator needs to find the error again: the address, the request. */
export interface ErrorPageDetail {
  readonly label: string;
  readonly value: string;
}

/** A place of the app worth going to instead, with the app's link. */
export interface ErrorPagePlace {
  readonly label: string;
  readonly link: Omit<LinkProps, 'children'>;
}

export interface ErrorPageProps {
  /** Above the title: the error's kind, such as "Error 404". */
  readonly kicker: ReactNode;
  readonly title: ReactNode;
  /** What happened, and what still holds. */
  readonly lead: ReactNode;
  /** The ways out: a button, then a link. */
  readonly actions: ReactNode;
  /** Under the title's sentence, for the operator: the address asked for, or the failed request. */
  readonly details?: readonly ErrorPageDetail[];
  /** The app's places, offered under the actions. */
  readonly places?: readonly ErrorPagePlace[];
  /** Beside the logo: the app's role, such as "operator". */
  readonly role?: ReactNode;
  /** At the end of the top bar: the language switch. */
  readonly headerEnd?: ReactNode;
}

/**
 * A page that cannot be shown, outside the app's frame: the large tulip, what happened, and the
 * ways out. It needs nothing of the app but its texts and its links, so it shows even when the
 * app's frame cannot load.
 */
export function ErrorPage({
  kicker,
  title,
  lead,
  actions,
  details,
  places,
  role,
  headerEnd,
}: ErrorPageProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <header className="px-space-4 py-space-3 md:px-space-6 md:py-space-5">
        <BrandBar role={role} end={headerEnd} />
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-space-5 px-space-4 py-space-7 text-center md:px-space-6 md:pb-space-9">
        <Tulip size={TULIP_SIZE_ON_PHONE} className="block shrink-0 md:hidden" />
        <Tulip size={TULIP_SIZE_ON_COMPUTER} className="hidden shrink-0 md:block" />
        <Kicker>{kicker}</Kicker>
        <Heading level={1} size={HeadingSize.l} className="text-balance">
          {title}
        </Heading>
        <Text variant={TextVariant.lead} className="max-w-reading-width text-balance">
          {lead}
        </Text>
        {details && details.length > 0 && <ErrorDetails details={details} />}
        <div className="flex flex-wrap items-center justify-center gap-x-space-6 gap-y-space-4">
          {actions}
        </div>
        {places && places.length > 0 && <ErrorPlaces places={places} />}
      </main>
    </div>
  );
}

function ErrorDetails({ details }: { readonly details: readonly ErrorPageDetail[] }) {
  return (
    <dl className="flex max-w-full flex-col gap-space-2 bg-surface px-space-5 py-space-4 text-left md:max-w-reading-width">
      {details.map((detail) => (
        <div key={detail.label} className="flex gap-space-3">
          <dt className="w-space-9 shrink-0">
            <Text variant={TextVariant.meta} tone={TextTone.muted} render={<span />}>
              {detail.label}
            </Text>
          </dt>
          <dd className="min-w-0 break-all">
            <Text variant={TextVariant.meta} render={<span />}>
              {detail.value}
            </Text>
          </dd>
        </div>
      ))}
    </dl>
  );
}

function ErrorPlaces({ places }: { readonly places: readonly ErrorPagePlace[] }) {
  const messages = useMessages();
  const headingId = useId();
  return (
    <nav aria-labelledby={headingId} className="flex flex-col items-center gap-space-1">
      <Text id={headingId} variant={TextVariant.meta} tone={TextTone.muted}>
        {messages['errorPage.places']}
      </Text>
      <ul className="flex flex-wrap justify-center gap-x-space-6">
        {places.map((place) => (
          <li key={place.label}>
            <Link {...place.link}>
              {place.label}
              <ArrowRightIcon size={ICON_SIZE.inline} weight={ICON_WEIGHT} aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
