# @bram-van-osta/ui

## 0.37.0

### Minor Changes

- Adds `StatLayout.titled` (the label as the tile's title under a 2 px ink rule, the figure optional at its right, the note under them) and `StatGrid`'s `tileLayout` (20 by 16 px between titled tiles), `CalmCard`'s `kicker` and `size={CalmCardSize.compact}` (its heading at the label size), `StepList`'s `pausedNote` (the current step's line in place of "right now" and its lead time), `Field`'s `labelSize={FieldLabelSize.small}` (a search field's label in muted mono), and `size={ChoiceSize.compact}` on `CheckboxCards` and `RadioCards` with `ChoiceColumns.three` (48 px cards in semibold small text, two then three columns); the compact `FileDropZone` now stacks its description under its label, 64 px high on every screen, a `DocumentList` meta too long for its row wraps under its name, `Dialog` stacks its actions at the whole width on a phone, `StepProgressTone.sections` is 4 px high, and `ToggleGroupTone.answer` stacks its answers at the whole width on a phone, the pressed one's check shown there too.

### Patch Changes

- Updated dependencies
  - @bram-van-osta/tokens@0.11.0

## 0.36.0

### Minor Changes

- Adds `StepBand` (a journey's steps in a row, each a bar and its name, the current one in pale Delft with its vermilion diamond and its sub-state, the bars alone with the current step and its position on a phone) and `StepBandCompact` (its short bars for a list's row, read as "step n of m"), `WaitingCard` (what waits in rows under the vermilion rule, a row's main action the whole width on a phone) and `CalmCard` (its calm form on the surface), `DocumentList` (a journey's documents as links with their meta, one yet to come in grey and out of the tab order), and `StatGrid` (two to six figures a row, two on a phone), with `Stat` and `StatLink` taking a `figureFirst` layout and a `mark` before their label.
- Adds `Thread`, `ThreadDay` and `ThreadLine` (a journey's events by day, each a line that unfolds in place, with a button for what came earlier), `ToggleGroupTone.plain` (a list's filters in plain words, the pressed one underlined in Delft), `Link`'s `isNavigation` (a navigation's plain links, the current one underlined in Delft), `AgentMark` (the agent's square and words, a ring that turns while it works, still for less motion), `AgentWords` (behind its purple rule), `AgentAdvice` (on pale purple), and `Field`'s `agentDraft` (the agent's mark beside the label and its rule at the control's left).
- Adds `StepList` (a journey's numbered steps with their usual lead times, in a row on a computer and a column on a phone), `ToggleGroupTone.segments` (a row's answer among two to four, none pressed at first), `StepProgressTone.sections` (the current section in pale Delft), `FileDropZone`'s `isMultiple` (one file or several), and `MessageBubble`'s `isOwn` (the reader's own message in Delft at the right); the large `FileDropZone` keeps its dashed frame and its description on a phone, and a card's main action takes the whole width there.

### Patch Changes

- Updated dependencies
  - @bram-van-osta/tokens@0.10.1

## 0.35.0

### Minor Changes

- `Meter` and `SegmentMeter` take their measure as `parts`, each a value and a label, filled one after the other on the same track, the first solid and the next hatched in the tone's color, named in a legend under the meter that describes it for a screen reader; `value` keeps working alone, and becomes optional. `Meter`'s zone names keep a gap before the next tick, wrapping balanced at their spaces when wider than their zone, so two names never touch on a phone.

## 0.34.0

### Minor Changes

- `Disclosure`'s `part` variant takes an optional `preview`, a line of small muted text under the label while the part is folded, read after the label in its button's name, and a `previewMark` before it on its first line; without them, nothing changes.

## 0.33.0

### Minor Changes

- `Disclosure` takes a `part` variant: a page's part folds under its label row, the button inside a heading of the app's level over the ink rule, its caret and height still for a system that asks for less motion.

## 0.32.1

### Patch Changes

- `Tabs` holds more tabs than a phone's width: each label stays on one line, a row wider than its box scrolls sideways in it instead of the page, with the rule under every tab and the focus ring whole, and the open tab is brought into view when it changes, gliding unless the system asks for less motion.

## 0.32.0

### Minor Changes

- `ThumbnailRemovableTile` takes `src={null}` for an image not served yet, drawn as the awaited box in its 4:3 frame and read as "Loading…", a `note` under the box in Delft blue, and `isRefused`, a dashed box in place of the image with the note in vermilion; the remove button stays over the corner in every state, now `space-2` from the box's outer edge.

## 0.31.0

### Minor Changes

- 56edcad: Adds `ThumbnailRemovableTile`, an image of a `ThumbnailGrid` with a remove button over its corner (`removeLabel`, `onRemove`) and the app's field under it in place of a name, and `ThumbnailGrid`'s `columns`, `two` for such tiles: two columns on a computer, one on a phone.
- 051a497: Adds `ToggleGroupTone.answer` to `ToggleGroup`, a question's answers side by side in equal columns on every screen, `button-height` high in an ink hair, none pressed until one is chosen and the pressed one in Delft blue with its check on a computer; `ToggleGroup` also takes `labelledBy` in place of `label`, `value={null}` for none pressed, and `disabled`, and its `label` becomes optional.

## 0.30.0

### Minor Changes

- Adds `Switch`, a setting turned on or off at once, on a line of a settings list: its label (and an optional description) on the left, a square switch of `switch-width` by `switch-height` on the right with its `switch-knob`, in Delft blue when on and outlined in ink when off.

### Patch Changes

- Updated dependencies
  - @bram-van-osta/tokens@0.10.0

## 0.29.0

### Minor Changes

- afd975b: Adds `FileDropZone`, several files at once dropped or chosen, `large` (a dashed zone of `drop-zone-height` on a computer, a primary button on a phone) or `compact` (one dashed line of `drop-zone-compact-height`, `drop-zone-compact-phone-height` on a phone).
- 549cbe3: Adds `ProgressBar`, a file's upload on a bar of `progress-bar-height` in the line color, filled in Delft blue, muted once paused or in vermilion once it failed, read as a percentage in the language of the `UiProvider`.
- 5f9bbb2: Adds `ThumbnailGrid`, a category's files in 4:3 tiles, four columns on a computer and two on a phone, with `ThumbnailTile` (an image that opens), `ThumbnailCheckboxTile` (an image to tick, framed in Delft blue once ticked), `ThumbnailFileTile` and `ThumbnailFileTileLink` (a file by its format) and `ThumbnailTileAwaited` (a file on its way).

### Patch Changes

- Updated dependencies [afd975b]
- Updated dependencies [549cbe3]
  - @bram-van-osta/tokens@0.9.0

## 0.28.0

### Minor Changes

- `RadioGroup` takes an `orientation` (`RadioGroupOrientation`): `vertical` by default, as before, or `horizontal`, its answers side by side on one line and wrapping when it is too narrow.
- 8f199b9: Adds `Stat`, a figure and its label in a hairline tile for a description list, its `attention` tone under the vermilion rule with the figure in vermilion and an optional `note`, and `StatLink`, the same tile as a link or a button that filters a list.

## 0.27.0

### Minor Changes

- The meter's bars stop as far short of a zone's dashed tick on both sides and each zone's name starts on its tick, the first on the bar's start; the timeline's squares sit in a slot one line of their name high, centered on that line, the rule unbroken from one square to the next.

## 0.26.0

### Minor Changes

- The score ring draws its arc in Delft blue on its pale track, a data ring as the identity draws its data bars; a score to fix keeps its vermilion arc.

## 0.25.0

### Minor Changes

- Adds `Meter` (a measure on a scale cut into named zones, in Delft blue or ink), `SegmentMeter` (a count in segments: a weight on three steps, or points in blocks against a limit), `Timeline` (moments in order down a rule) and a `tone` on `Tag` (`plain`, `ink`, `solid`, `delft`, `agent`), to tell a fact's sources apart.

## 0.24.0

### Minor Changes

- Adds `ScoreRing` (a score in a ring, its figure inside and its short name under it), `StatusMark` (a measure's mark: good, to improve or to fix) and `Tag` (a short fact in a frame, a mark before it).

## 0.23.0

### Minor Changes

- `ImageViewer`, an image shown whole in a dialog, a tall one scrolled at the frame's width, with the app's `controls` beside Previous and Next (`onPrevious`, `onNext`, disabled at either end by `hasPrevious` and `hasNext`, and the left and right arrow keys), a link to the image alone (`originalHref`) and a `hint`, full screen on a phone; on a computer it takes the new `image-viewer-width` and `image-viewer-height` size tokens (820 and 560 px); and `Button` takes `isFocusableWhenDisabled`, for a command that turns unavailable under the focus.
- `ToggleGroup` takes a `tone` (`ToggleGroupTone`): Delft for a Delft band, as before and by default, or ink on the page's own background, such as an `ImageViewer`'s controls: its segments in white with ink text in an ink hair, the pressed one in ink, the whole width on a phone.

### Patch Changes

- Updated dependencies
  - @bram-van-osta/tokens@0.8.0

## 0.22.0

### Minor Changes

- `Thumbnail`, the top of an image cropped to a box of the given `width` and `height`, a button named by its `label` with an optional `caption` under it, that opens the whole image; `ThumbnailLink`, the same as a link, whose `render` takes the router's link; and `ThumbnailAwaited` and `ThumbnailLeftOut`, its place while the image is awaited and when there is none, with a `reason`.

## 0.21.0

### Minor Changes

- `RadioCards` and `CheckboxCards` take `columns`, `ChoiceColumns.auto` by default (two columns once the group is 28 rem wide, as before) or `ChoiceColumns.one`, a list with one answer per row on every width.
- `StepProgress` takes `tone`, `StepProgressTone.delft` by default (the filled segments in Delft blue, as before) or `StepProgressTone.ink`, the done segments in ink and the current one, the last filled, in vermilion; each segment carries its state in `data-state` (`done`, `current`, `upcoming`) in place of `data-filled`.

## 0.20.1

### Patch Changes

- A pending button without an arrow keeps its width: the spinner covers its label instead of following it, so that it no longer pushes its neighbors to another line.

## 0.20.0

### Minor Changes

- The toasts stack, three at most: the newest in front, the two before it smaller behind, unfolded into a column on hover or from the keyboard (F6), a fourth sending the oldest away; they come up and fade in, go down and fade out, slide to their place and can be swiped away, with a fade alone under reduced motion; on a computer they take the new `toast-width` size token (420 px).

### Patch Changes

- Updated dependencies
  - @bram-van-osta/tokens@0.7.0

## 0.19.1

### Patch Changes

- The tabs' count stays on the line of its label's last word, however narrow the phone; the text area's `ref` is typed as the text area it is.

## 0.19.0

### Minor Changes

- `Tabs`, a few panels behind a row of tabs underlined at their width on a rule, one open, with an optional count beside a tab's label.

## 0.18.0

### Minor Changes

- `TextInput`, `PasswordInput` and `Select` write their typed text and placeholder at the body size, 16 px, like `TextArea`, at the same height and padding; the one-line controls share the text area's classes again.

### Patch Changes

- Updated dependencies
  - @bram-van-osta/tokens@0.6.0

## 0.17.0

### Minor Changes

- The toast is an ink band that leaves by itself, with a check or, given `tone: ToastTone.failed`, a vermilion warning, and no close button (the `toast.close` message is removed); `IconButton` takes `size: IconButtonSize.compact`, a 16 px icon in a 28 px square that keeps a 44 px target, on which the new `CopyButton` copies a value from within a line of text and shows "Copied" beside it; `TextArea` writes at the body size, grows with its text up to 60% of the screen's height, and no longer has a resize handle.

### Patch Changes

- Updated dependencies
  - @bram-van-osta/tokens@0.5.0

## 0.16.0

### Minor Changes

- `StepProgress` takes optional `parts` (`label`, `shortLabel`, `steps`), whose steps add up to `max`: the segments grouped by part, and each part's name under the bar, checked once done, in vermilion while current, muted after, its short name on a phone; without `parts`, nothing changes.

## 0.15.0

### Minor Changes

- `ToggleGroup`, a few mutually exclusive views side by side on a Delft band, one always pressed, such as a preview's computer and phone: its `options`, `value`, `defaultValue`, `onValueChange` and its accessible `label`.

## 0.14.0

### Minor Changes

- 116d630: The `detail` field of `RadioCards` and `CheckboxCards` now shows only once one of its `forValues` is chosen, focused when chosen with a click or Space, and hides again when none is, keeping its text; its new `placeholder` takes the app's hint.
- bc0dace: `Menu`'s button has no border, shows the surface on hover and while open with an `Avatar` in it on the page's background, and its popup opens 4 px under it in a `line` hair; `triggerVariant` and `MenuTriggerVariant` are removed, `AccountMenu` taking that look with its name.

## 0.13.0

### Minor Changes

- ff97c5f: `ButtonLink`, a link that looks like a `Button`, with its variants, its icon and its forward arrow, for an action that opens another page; `render` takes the app's router link, such as `render={<RouterLink to="/offer/adjust" />}`.

## 0.12.0

### Minor Changes

- 9cc574f: `ActionCard`, what depends on the reader on surface under a vermillion rule: its band (`kicker`), an optional `heading` that names it, its content and its `actions`.
- 064b06c: `CodeInput`, a one-time code of six digits on Base UI's OTP field, inside a `Field`: typed, pasted or offered by the phone (`autocomplete="one-time-code"`, a numeric keyboard), each slot named ("Digit 2 of 6", `codeInput.slot`), with `onComplete` and `CODE_LENGTH`; a whole code typed, suggested, dropped or pasted over a wrong one replaces it.
- cec9a51: `CopyList`, values to copy one by one such as bank details: each row shows its label, its value in IBM Plex Mono and a 44 px button that copies it, then says "Copied" for a moment; its texts come from the package's messages (`copyList.copy`, `copyList.copied`, `copyList.failed`) unless the app gives its own, and an optional `copyValue` copies another text (an IBAN without its spaces).
- 2784608: `MessageBubble`, a message quoted in a bubble on surface under its caption, who wrote it and when, both given by the app; the client's messages and the studio's look the same, as the brand book draws them.

## 0.11.0

### Minor Changes

- 264a449: `CheckboxCards`, every answer that applies among cards in two columns where there is room, with `value: string[]`, an error under the group and the same `detail` text field of "Other…" across the grid.
- d83cade: `FileInput`, one file dropped or chosen, then shown by its name with a button to remove it; the app checks the file in `onFileChange` and says what is wrong in `error`. Two new texts, `fileInput.choose` and `fileInput.remove`.
- e79581f: `RadioCards`, one answer among cards in two columns where there is room, an answer set apart (`isSetApart`), and the `detail` text field of "Other…" beside or under the cards, which takes the focus when its answer is chosen.
- 55dc198: `FormAlert`, `AuthBlock` and `CheckMailbox` are exported: a form's failure in its box, a page's kicker, heading, lead and action, and "Check your mailbox" with the app's own kicker and lead.
- 604d059: `StepProgress`, a journey's progress in segments, the done ones in Delft blue, with the `label` and the `valueText` the app gives to screen readers.
- df5a724: `TextArea`, a few sentences inside a `Field`: the text control's outline, `rows` lines at first (3 by default), and taller at will.

### Patch Changes

- Updated dependencies [604d059]
  - @bram-van-osta/tokens@0.4.0

## 0.10.0

### Minor Changes

- 622b4fd: `AuthLayout` takes a `footer`, such as the links to the legal texts: at the bottom of the block's column on a computer, under the block on a phone.
- b5384cc: `Disclosure` folds content under its summary, such as a long page's contents on a phone, on Base UI's Collapsible.
- 8329c02: `Link` takes `isInline` for a link inside a sentence: the sentence's size and line, underlined, with no minimum height.
- 15c2dd4: `Table` sets facts side by side, such as a legal text's processors or retention periods, under a caption for screen readers; wider than the screen, it scrolls sideways in its own box, which the keyboard then reaches.

## 0.9.0

### Minor Changes

- `AccountMenu` puts the account's actions behind an outlined button with its avatar and its name (the avatar alone on a phone), and `Menu` takes a `triggerVariant`, `quiet` or `outlined`.

### Patch Changes

- Updated dependencies
  - @bram-van-osta/tokens@0.3.0

## 0.8.1

### Patch Changes

- The error icon, the password rules' icons and the Checkbox and Radio boxes are centered on the first line of their text, whatever its size or line height, and stay at the top when it wraps.

## 0.8.0

### Minor Changes

- Errors stand out more: the error icon is vermillion under a field and in a form alert, and the authentication blocks' form alert is a box on `surface` under a vermillion `border-attention` top rule, its words still in ink.

### Patch Changes

- Updated dependencies
  - @bram-van-osta/tokens@0.2.1

## 0.7.0

### Minor Changes

- The authentication blocks show every failure of their action in their own alert, with new statuses: `SignInStatus.failed` and `linkRefused`, `ForgotPasswordStatus` and `ResendStatus` `tooManyRequests` and `failed`, and `NewPasswordStatus` `tooManyAttempts` and `failed`.

## 0.6.2

### Patch Changes

- On a computer, `AuthLayout`'s language switch in the grey panel now sits on the row of the column's logo, vertically centered with it, instead of at the top of the large tulip.

## 0.6.1

### Patch Changes

- The tulip is drawn with its stem and leaf as one outline under the flower, so it shows no notch under the flower and no seam along the stem, at any size.

## 0.6.0

### Minor Changes

- On a computer, `AuthLayout` shows its `headerEnd` (the language switch) at the top right of the grey panel, across from the large tulip, instead of in the top bar beside the logo; on a phone it stays at the end of the top bar.

## 0.5.0

### Minor Changes

- `AuthLayout` frames the authentication blocks as round 7 draws them, each block shows its kicker, `SignIn` takes a `lead` and a `note` and makes its first provider the primary button when it has no password form, the submit buttons span the form, and `ErrorPage` is new: a page centered outside the app's frame, with its details and its places.

## 0.4.1

### Patch Changes

- `form-width` (420 px), the width of a short form on a computer; the authentication blocks keep their fields and buttons within it, under a heading and a lead that keep the reading column.
- Updated dependencies
  - @bram-van-osta/tokens@0.2.0

## 0.4.0

### Minor Changes

- `Avatar`, a person by the initials of their name in a circle, and `Menu`, a few actions behind one button, such as the account's behind its avatar.

## 0.3.1

### Patch Changes

- `SetPassword`, `ResetPassword`, `ForgotPassword` and `VerifyEmail` are exported, with their statuses and types: 0.3.0 exported `SignIn` only.

## 0.3.0

### Minor Changes

- The authentication blocks, `SignIn`, `SetPassword`, `ForgotPassword`, `ResetPassword` and `VerifyEmail`, purely visual and with their texts in French and English; `Container` keeps its reading column inside a flex column, and its `className` now styles that column.

## 0.2.0

### Minor Changes

- The base components, from the buttons to the logo, with `UiProvider` for their texts in French or English and the identity's keyboard focus in `styles.css`.

## 0.1.0

### Minor Changes

- The components' package, wired: React 19 and Base UI as peers, Phosphor icons, the tokens as its Tailwind theme. No component yet.

### Patch Changes

- Updated dependencies
  - @bram-van-osta/tokens@0.1.0
