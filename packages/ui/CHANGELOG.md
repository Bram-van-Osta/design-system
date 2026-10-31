# @bram-van-osta/ui

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
