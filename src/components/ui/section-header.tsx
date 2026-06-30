import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: { label: string; href?: string }[]
  action?: React.ReactNode
  className?: string
}

function SectionHeader({
  title,
  description,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div>
        <h2 className="text-lg font-semibold text-dark-50">{title}</h2>
        {description && (
          <p className="text-sm text-dark-100">{description}</p>
        )}
      </div>
      {action && <div className="mt-2 sm:mt-0">{action}</div>}
    </div>
  )
}

function PageHeader({
  title,
  description,
  breadcrumbs,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-sm text-dark-100">
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center gap-2">
              {index > 0 && <span>/</span>}
              {crumb.href ? (
                <a
                  href={crumb.href}
                  className="transition-colors hover:text-dark-50"
                >
                  {crumb.label}
                </a>
              ) : (
                <span className="text-dark-50">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <SectionHeader
        title={title}
        description={description}
        action={action}
      />
    </div>
  )
}

export { SectionHeader, PageHeader }
