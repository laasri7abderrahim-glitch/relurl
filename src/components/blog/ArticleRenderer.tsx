import { BlogPost } from "@/lib/blog/types"
import { Link } from "@/i18n/navigation"

export function ArticleRenderer({ post }: { post: BlogPost }) {
  return (
    <article className="prose prose-lg dark:prose-invert max-w-none">
      {post.content.map((section, i) => {
        switch (section.type) {
          case "heading":
            return section.level === 2 ? (
              <h2 key={i} className="text-2xl font-bold mt-10 mb-4">{section.content}</h2>
            ) : (
              <h3 key={i} className="text-xl font-semibold mt-8 mb-3">{section.content}</h3>
            )
          case "paragraph":
            return <p key={i} className="text-muted-foreground leading-relaxed mb-4">{section.content}</p>
          case "list":
            return (
              <ul key={i} className="list-disc pl-6 space-y-2 mb-6">
                {section.items?.map((item, j) => (
                  <li key={j} className="text-muted-foreground">{item}</li>
                ))}
              </ul>
            )
          case "faq":
            return (
              <div key={i} className="my-8 space-y-4">
                <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
                {section.faqs?.map((faq, j) => (
                  <div key={j} className="border border-border/50 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">{faq.q}</h3>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </div>
                ))}
              </div>
            )
          case "cta":
            return (
              <div key={i} className="bg-primary/5 border border-primary/20 rounded-xl p-6 my-8 text-center">
                <p className="text-lg font-medium mb-4">{section.content}</p>
                <Link
                  href={post.landingPage}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Try It Free
                </Link>
              </div>
            )
          default:
            return null
        }
      })}
    </article>
  )
}
