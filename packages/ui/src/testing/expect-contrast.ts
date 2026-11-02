import { expect } from 'storybook/test';

const SRGB_CHANNEL_MAX = 255;
// WCAG 2's relative luminance: the sRGB channels made linear, then weighted.
const LINEAR_THRESHOLD = 0.04045;
const LUMINANCE_WEIGHTS = [0.2126, 0.7152, 0.0722] as const;
const FLARE = 0.05;

function channelsOf(color: string): readonly number[] {
  const channels =
    color
      .match(/\d+(\.\d+)?/g)
      ?.slice(0, 3)
      .map(Number) ?? [];
  if (channels.length !== 3) {
    throw new Error(`Not an rgb() color: ${color}`);
  }
  return channels;
}

function luminanceOf(color: string): number {
  return channelsOf(color).reduce((sum, channel, index) => {
    const value = channel / SRGB_CHANNEL_MAX;
    const linear = value <= LINEAR_THRESHOLD ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    return sum + linear * (LUMINANCE_WEIGHTS[index] ?? 0);
  }, 0);
}

/** The WCAG contrast ratio of two computed rgb() colors. */
export function contrastRatio(first: string, second: string): number {
  const [lighter, darker] = [luminanceOf(first), luminanceOf(second)].sort((a, b) => b - a);
  return ((lighter ?? 0) + FLARE) / ((darker ?? 0) + FLARE);
}

export async function expectContrastAtLeast(
  foreground: string,
  background: string,
  ratio: number,
): Promise<void> {
  await expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(ratio);
}
