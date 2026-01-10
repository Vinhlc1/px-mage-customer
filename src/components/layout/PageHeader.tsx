interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export default function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="text-center mb-12">
      <h1 className="text-5xl font-serif font-bold mb-4">{title}</h1>
      {description && (
        <p className="text-xl text-muted-foreground">{description}</p>
      )}
      {children}
    </div>
  );
}
