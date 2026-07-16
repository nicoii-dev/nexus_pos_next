import { PageHeader } from "@/components/page-header";

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function ChartCard({ title, description, children, action }: ChartCardProps) {
  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="flex items-center justify-between p-6 pb-2">
        <PageHeader title={title} description={description} />
        {action}
      </div>
      <div className="p-6 pt-2">{children}</div>
    </div>
  );
}
