export interface SpacingOptions {
  unit?: number;
}

export function createSpacing(spacing: SpacingOptions = {}) {
  const unit = spacing.unit ?? 8;

  return (factor: number) => `${unit * factor}px`;
}
