export default function PageHeader({ title, children }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
      </div>
      {children && <div className="header-actions">{children}</div>}
    </div>
  );
}
