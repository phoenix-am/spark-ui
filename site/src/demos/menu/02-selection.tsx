/** Menus can hold a choice too, like a sort order. */
import { Menu, Button } from '@sparkwire/core';

export default function Selection() {
  return (
    <Menu
      label="Sort by"
      selectionMode="single"
      defaultSelectedKeys={['newest']}
      trigger={<Button variant="text">Sort</Button>}
      items={[
        { key: 'newest', label: 'Newest first' },
        { key: 'oldest', label: 'Oldest first' },
        { key: 'name', label: 'Name' },
      ]}
    />
  );
}
