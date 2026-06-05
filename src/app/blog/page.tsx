import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Blog() {
  return (
    <main className="w-full">
      <Header />
      <section className="min-h-screen pt-28 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="font-galmuri text-4xl md:text-5xl font-bold mb-8 text-text-primary">
            Blog
          </h1>
          <p className="font-pretendard text-lg text-text-secondary">
            Blog page coming soon...
          </p>
        </div>
      </section>
      <Footer />
    </main>
  )
}
