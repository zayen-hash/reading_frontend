import { getAllNovels } from "@/lib/sheets"
import { getSampleNovels, isUsingSampleData } from "@/lib/dev-data"
import { NovelCard } from "@/components/novel-card"
import { FetchError } from "@/components/fetch-error"

export const revalidate = 3600

export default async function HomePage() {
  let novels
  let fetchError = false

  try {
    novels = isUsingSampleData() ? getSampleNovels() : await getAllNovels()
  } catch {
    fetchError = true
  }

  if (fetchError) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-2 text-3xl font-bold">
          {process.env.NEXT_PUBLIC_SITE_NAME || "Novels"}
        </h1>
        <FetchError message="Failed to load novels. Please check back later." />
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">
        {process.env.NEXT_PUBLIC_SITE_NAME || "Novels"}
      </h1>
      <p className="mb-8 text-muted-foreground">
        {process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
          "Fan-translated novels for your reading pleasure"}
      </p>

      {novels!.length === 0 ? (
        <p className="text-muted-foreground">
          No novels published yet. Check back soon!
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {novels!.map((novel) => (
            <NovelCard key={novel.slug} novel={novel} />
          ))}
        </div>
      )}
    </main>
  )
}
