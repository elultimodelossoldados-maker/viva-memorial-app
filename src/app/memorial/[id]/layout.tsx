// Server component layout — provides generateStaticParams for static export
export function generateStaticParams() {
  return [{ id: "_" }];
}

export default function MemorialLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
