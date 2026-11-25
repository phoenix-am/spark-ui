/** Ids for rows in the API reference, shared by the tables and the search. */
export const anchor = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');
export const propAnchor = (component: string, prop: string) => `prop-${anchor(component)}-${anchor(prop)}`;
export const eventAnchor = (component: string, event: string) => `event-${anchor(component)}-${anchor(event)}`;
export const varAnchor = (component: string, name: string) => `var-${anchor(component)}-${anchor(name)}`;
