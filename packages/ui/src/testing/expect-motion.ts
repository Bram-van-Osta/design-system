import { expect } from 'storybook/test';

const MOTION_ALLOWED = 'prefers-reduced-motion: no-preference';

interface RuleOnPath {
  readonly rule: CSSRule;
  readonly selectors: readonly string[];
  readonly media: readonly string[];
}

function rulesOf(
  rules: CSSRuleList | readonly CSSRule[],
  path: Omit<RuleOnPath, 'rule'>,
): RuleOnPath[] {
  return [...rules].flatMap((rule) => {
    const selectors =
      rule instanceof CSSStyleRule ? [...path.selectors, rule.selectorText] : path.selectors;
    const media = rule instanceof CSSMediaRule ? [...path.media, rule.conditionText] : path.media;
    const children =
      'cssRules' in rule && rule.cssRules instanceof CSSRuleList ? rule.cssRules : null;
    const here = { rule, selectors, media };
    return children === null ? [here] : [here, ...rulesOf(children, { selectors, media })];
  });
}

// A sheet from another origin keeps its rules: none of the components' are there.
function rulesOfSheet(sheet: CSSStyleSheet): CSSRuleList | readonly CSSRule[] {
  try {
    return sheet.cssRules;
  } catch {
    return [];
  }
}

function declares(rule: CSSRule, property: string): boolean {
  return (
    (rule instanceof CSSStyleRule || rule instanceof CSSNestedDeclarations) &&
    rule.style.getPropertyValue(property) !== ''
  );
}

async function expectOnlyWhenMotionAllowed(element: Element, property: string): Promise<void> {
  const motions = [...document.styleSheets]
    .flatMap((sheet) => rulesOf(rulesOfSheet(sheet), { selectors: [], media: [] }))
    .filter(({ rule, selectors }) => declares(rule, property) && selectors.some(matching(element)));
  await expect(motions.length).toBeGreaterThan(0);
  for (const { media } of motions) {
    await expect(media.some((condition) => condition.includes(MOTION_ALLOWED))).toBe(true);
  }
}

/** The element's transitions are declared only for a system that does not ask for less motion. */
export async function expectTransitionOnlyWhenMotionAllowed(element: Element): Promise<void> {
  await expectOnlyWhenMotionAllowed(element, 'transition-property');
}

/** The element's animation is declared only for a system that does not ask for less motion. */
export async function expectAnimationOnlyWhenMotionAllowed(element: Element): Promise<void> {
  await expectOnlyWhenMotionAllowed(element, 'animation');
}

function matching(element: Element): (selector: string) => boolean {
  return (selector) => {
    try {
      return element.matches(selector);
    } catch {
      return false;
    }
  };
}
