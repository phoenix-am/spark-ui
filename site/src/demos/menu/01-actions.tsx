/** A list of actions behind a button. Arrow keys move, Enter picks, and typing jumps to an item. */
import { Menu, Button } from '@sparkwire/core';

export default function Actions() {
  return (
    <Menu
      label="Project actions"
      trigger={<Button variant="outlined">Actions</Button>}
      onAction={(key) => console.log(key)}
      items={[
        { key: 'rename', label: 'Rename' },
        { key: 'duplicate', label: 'Duplicate' },
        { title: 'Danger zone', items: [{ key: 'delete', label: 'Delete project', description: 'This cannot be undone' }] },
      ]}
    />
  );
}
