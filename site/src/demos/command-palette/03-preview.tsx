/** Show more about the highlighted result with `preview`, and narrow the search with a `toolbar`. The panel widens for the preview and hides it on small screens. */
import { useState } from 'react';
import { CommandPalette, Button, ToggleGroup, ToggleGroupItem } from '@sparkwire/core';

const people = [
  { id: 'asha', label: 'Asha Rao', team: 'Design', role: 'Leads the design system' },
  { id: 'vikram', label: 'Vikram Shah', team: 'Platform', role: 'Keeps deploys boring' },
  { id: 'meera', label: 'Meera Iyer', team: 'Design', role: 'Owns onboarding' },
  { id: 'kabir', label: 'Kabir Mehta', team: 'Platform', role: 'On call this week' },
];

export default function Preview() {
  const [open, setOpen] = useState(false);
  const [team, setTeam] = useState('All');
  const shown = people.filter((p) => team === 'All' || p.team === team);
  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>Find a teammate</Button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        hotkey={false}
        placeholder="Search people…"
        items={[{ heading: 'People', items: shown.map((p) => ({ id: p.id, label: p.label, description: p.team })) }]}
        toolbar={
          <ToggleGroup aria-label="Team" size="small" value={team} onChange={(v) => v && setTeam(v as string)}>
            <ToggleGroupItem value="All">All</ToggleGroupItem>
            <ToggleGroupItem value="Design">Design</ToggleGroupItem>
            <ToggleGroupItem value="Platform">Platform</ToggleGroupItem>
          </ToggleGroup>
        }
        preview={(cmd) => {
          const p = people.find((x) => x.id === cmd?.id);
          return p ? (
            <div>
              <h3 style={{ margin: 0 }}>{p.label}</h3>
              <p>{p.team} · {p.role}</p>
            </div>
          ) : (
            <p>No one selected.</p>
          );
        }}
      />
    </>
  );
}
