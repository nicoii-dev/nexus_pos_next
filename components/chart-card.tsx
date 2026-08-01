import { PageHeader } from "@/components/page-header";

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function ChartCard({ title, description, children, action }: ChartCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-[10px] border bg-card shadow-float transition-all duration-300 card-hover">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="flex items-center justify-between p-6 pb-2">
        <PageHeader title={title} description={description} />
        {action}
      </div>
      <div className="p-6 pt-2">{children}</div>
    </div>
  );
}
