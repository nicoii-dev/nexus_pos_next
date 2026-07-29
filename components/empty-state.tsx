import { PackageOpen } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-16 text-center animate-in-scale">
      <div className="mb-5 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-5">
        {icon || <PackageOpen className="h-9 w-9 text-primary/60" />}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground max-w-sm">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
