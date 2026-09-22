/**
 * Character counters stay hidden until the user is close to the limit, so a
 * short entry is never cluttered by a count it will not get near. The lead is
 * proportional for long fields and a flat 3 characters for short ones.
 */
export function shouldShowCharacterCount(
  length: number,
  maxLength: number,
): boolean {
  const lead = Math.max(3, Math.round(maxLength * 0.2));
  return length >= maxLength - lead;
}
