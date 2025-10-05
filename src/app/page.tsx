import dynamic from 'next/dynamic'

const Dashboard = dynamic(() => import('@/components/dashboard').then(mod => mod.Dashboard), {
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center">
      <p className="text-lg text-muted-foreground">Carregando aplicativo...</p>
    </div>
  ),
  ssr: false
})

export default function Home() {
  return (
    <main>
      <Dashboard />
    </main>
  );
}
