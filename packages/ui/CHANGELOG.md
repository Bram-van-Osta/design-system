# @bram-van-osta/ui

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
