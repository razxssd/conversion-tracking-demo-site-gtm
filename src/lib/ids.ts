// Tiny ID/timestamp helpers kept outside React components so the
// react-hooks/purity lint rule doesn't flag Date.now() usage. These are only
// ever called from event handlers, where impurity is expected.

export function newOrderId(): string {
  return `ORD-${Date.now()}`
}

export function newTestClickId(): string {
  return `test_click_${Date.now()}`
}

export function nowIso(): string {
  return new Date().toISOString()
}
