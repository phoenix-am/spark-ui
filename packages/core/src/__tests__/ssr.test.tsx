/** @jest-environment node */
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Tabs, TabList, Tab, TabPanel, DatePicker, Calendar } from '..';

describe('server rendering', () => {
  it('renders tabs and the default panel', () => {
    const html = renderToString(
      <Tabs defaultValue="b">
        <TabList aria-label="SSR">
          <Tab value="a">A</Tab>
          <Tab value="b">B</Tab>
        </TabList>
        <TabPanel value="b">Panel B</TabPanel>
      </Tabs>,
    );
    expect(html).toContain('role="tab"');
    expect(html).toContain('aria-selected="true"');
    expect(html).toContain('Panel B');
  });

  it('renders the date field segments and the hidden ISO value', () => {
    const html = renderToString(<DatePicker label="Start" locale="en-IN" name="d" defaultValue={new Date(2026, 11, 25)} />);
    expect(html).toContain('sp-date-field__segment');
    expect(html).toContain('value="2026-12-25"');
  });

  it('renders a calendar grid', () => {
    const html = renderToString(<Calendar locale="en-IN" defaultValue={new Date(2026, 10, 10)} />);
    expect(html).toContain('role="grid"');
    expect(html).toContain('November 2026');
  });
});
