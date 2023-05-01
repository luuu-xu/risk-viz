
export default function MapPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="h-screen w-screen d-flex flex-col">
      {children}
    </main>
  )
}
