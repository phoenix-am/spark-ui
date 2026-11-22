import React, { useState } from 'react';
import { Tabs, TabList, Tab, TabPanel } from '../../Tabs';
import { Card } from '../../Card';
import { Textfield } from '../../Textfield';
import { Textarea } from '../../Textarea';
import { Dropdown } from '../../Dropdown';
import { Switch } from '../../Switch';
import { Button } from '../../Button';
import { Avatar } from '../../Avatar';
import { FileUpload } from '../../FileUpload';
import { ToggleGroup } from '../../ToggleGroup';
import { useToast } from '../../Toast';

/**
 * Settings block: profile, notifications and appearance tabs with a save
 * bar that appears when something changed. Copy with
 * `npx sparkwire add settings` and wire `onSave` to your API.
 */
export function Settings({ onSave }: { onSave?: (values: Record<string, unknown>) => void }) {
  const toast = useToast();
  const initial = { name: 'Anmol Mehta', email: 'anmol@example.com', bio: 'Frontend engineer. Building Sparkwire.', language: 'en', email_digest: true, mentions: true, product: false, theme: 'system', energy: 'default' };
  const [v, setV] = useState(initial);
  const set = <K extends keyof typeof initial>(k: K, value: (typeof initial)[K]) => setV((p) => ({ ...p, [k]: value }));
  const dirty = JSON.stringify(v) !== JSON.stringify(initial);

  return (
    <div className="sp-block-settings">
      <header className="sp-block-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your profile and how Sparkwire behaves.</p>
        </div>
      </header>
      <Tabs defaultValue="profile">
        <TabList aria-label="Settings sections">
          <Tab value="profile">Profile</Tab>
          <Tab value="notifications">Notifications</Tab>
          <Tab value="appearance">Appearance</Tab>
        </TabList>

        <TabPanel value="profile">
          <Card padding="large">
            <div className="sp-block-settings__grid">
              <div className="sp-block-settings__avatar">
                <Avatar name={v.name} size="xlarge" />
                <FileUpload accept="image/*" multiple={false} maxSize={2 * 1024 * 1024} previews={false} prompt="Change photo" />
              </div>
              <div className="sp-block-settings__fields">
                <Textfield label="Full name" name="name" value={v.name} onChange={(e) => set('name', e.target.value)} />
                <Textfield label="Email" name="email" type="email" value={v.email} onChange={(e) => set('email', e.target.value)} />
                <Textarea label="Bio" name="bio" maxLength={160} showCount value={v.bio} onChange={(text) => set('bio', text)} minRows={2} />
                <Dropdown
                  label="Language"
                  value={v.language}
                  onChange={(lang) => set('language', lang)}
                  options={[
                    { value: 'en', label: 'English' },
                    { value: 'hi', label: 'हिन्दी' },
                    { value: 'gu', label: 'ગુજરાતી' },
                    { value: 'ta', label: 'தமிழ்' },
                  ]}
                />
              </div>
            </div>
          </Card>
        </TabPanel>

        <TabPanel value="notifications">
          <Card padding="large">
            <div className="sp-block-settings__list">
              <Switch label="Weekly email digest" checked={v.email_digest} onChange={(on) => set('email_digest', on)} />
              <Switch label="Mentions and replies" checked={v.mentions} onChange={(on) => set('mentions', on)} />
              <Switch label="Product updates" checked={v.product} onChange={(on) => set('product', on)} />
            </div>
          </Card>
        </TabPanel>

        <TabPanel value="appearance">
          <Card padding="large">
            <div className="sp-block-settings__list">
              <div className="sp-block-settings__setting">
                <span id="theme-label">Theme</span>
                <ToggleGroup aria-labelledby="theme-label" value={v.theme} onChange={(t) => t && set('theme', t)}>
                  <ToggleGroup.Item value="light">Light</ToggleGroup.Item>
                  <ToggleGroup.Item value="dark">Dark</ToggleGroup.Item>
                  <ToggleGroup.Item value="system">System</ToggleGroup.Item>
                </ToggleGroup>
              </div>
              <div className="sp-block-settings__setting">
                <span id="energy-label">Motion</span>
                <ToggleGroup aria-labelledby="energy-label" value={v.energy} onChange={(t) => t && set('energy', t)}>
                  <ToggleGroup.Item value="off">Off</ToggleGroup.Item>
                  <ToggleGroup.Item value="calm">Calm</ToggleGroup.Item>
                  <ToggleGroup.Item value="default">Default</ToggleGroup.Item>
                  <ToggleGroup.Item value="electric">Electric</ToggleGroup.Item>
                </ToggleGroup>
              </div>
            </div>
          </Card>
        </TabPanel>
      </Tabs>

      {dirty && (
        <div className="sp-block-savebar" role="region" aria-label="Unsaved changes">
          <span>You have unsaved changes.</span>
          <Button variant="text" size="small" onClick={() => setV(initial)}>
            Discard
          </Button>
          <Button
            size="small"
            onClick={() => {
              onSave?.(v);
              toast.toast({ title: 'Settings saved', tone: 'success' });
            }}
          >
            Save changes
          </Button>
        </div>
      )}
    </div>
  );
}
