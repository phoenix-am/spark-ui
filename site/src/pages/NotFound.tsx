import React from 'react';
import { Link } from 'react-router';
import { Button } from '@sparkwire/core';

export function NotFound() {
  return (
    <div className="sw-page sw-notfound">
      <p className="sw-eyebrow">404</p>
      <h1>This wire's not connected</h1>
      <p className="sw-lead">The page you're after doesn't exist, or it moved when the docs got their new home.</p>
      <Button as={Link} to="/">Back to the start</Button>
    </div>
  );
}
