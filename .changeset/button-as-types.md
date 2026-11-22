---
"@sparkwire/core": patch
---

Button: `as` now types the props of the element you render as, so `<Button as="a" href="…" target="_blank">` and `<Button as={Link} to="/">` type-check. Component descriptions rewritten in plain language, and the toast docs now show the real API (`const { toast } = useToast()`).
