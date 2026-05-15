// Server component layout — provides generateStaticParams for static export
// The actual page content is in page.tsx (client component)
export function generateStaticParams() {
  // Generate a placeholder so Next.js static export doesn't fail.
  // Real altar IDs are resolved client-side from localStorage.
  return [{ id: "_" }];
}

export default function AltarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
