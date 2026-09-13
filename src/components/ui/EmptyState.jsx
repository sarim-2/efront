import React from 'react';
import { Link } from 'react-router-dom';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';

export function EmptyState({
  icon: Icon = PackageOpen,
  title = 'No items found',
  description = 'There are no items to display at the moment.',
  actionText,
  actionLink,
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] py-12 px-4 text-center border border-dashed border-border rounded-lg bg-muted/30">
      <div className="p-4 bg-muted rounded-full mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold tracking-tight mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      {actionText && actionLink && (
        <Link to={actionLink}>
          <Button>{actionText}</Button>
        </Link>
      )}
    </div>
  );
}
