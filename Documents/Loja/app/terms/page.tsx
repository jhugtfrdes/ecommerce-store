import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Bubble Wrap Factory",
  description: "Terms of Service for Bubble Wrap Factory and its TikTok integration."
};

const sections = [
  {
    title: "Use of the Service",
    body: [
      "Bubble Wrap Factory allows authorized users to create, manage, and publish content through supported TikTok developer features.",
      "By using Bubble Wrap Factory, you confirm that you have the right to connect the TikTok account you authorize."
    ]
  },
  {
    title: "TikTok Authorization",
    body: [
      "You authorize Bubble Wrap Factory to publish content to your TikTok account when you grant the required permissions through TikTok's official OAuth 2.0 flow.",
      "Bubble Wrap Factory will only use TikTok permissions for features you request or authorize."
    ]
  },
  {
    title: "User Responsibility",
    body: [
      "You are solely responsible for the content you create, upload, schedule, submit, or publish using Bubble Wrap Factory.",
      "You must ensure that your content complies with applicable laws, TikTok's terms and policies, and the rights of third parties."
    ]
  },
  {
    title: "Prohibited Use",
    body: [
      "You may not use Bubble Wrap Factory for spam, fraud, impersonation, unauthorized automation, illegal activity, or content that violates TikTok rules or applicable law.",
      "You may not attempt to bypass usage limits, security controls, or authorization requirements."
    ]
  },
  {
    title: "Service Changes",
    body: [
      "Bubble Wrap Factory may be changed, suspended, or discontinued at any time, including when required by TikTok platform changes or operational needs.",
      "We do not guarantee permanent availability, uninterrupted access, or error-free operation."
    ]
  },
  {
    title: "Access Revocation",
    body: [
      "We may suspend or revoke access to Bubble Wrap Factory if we believe the service is being abused, used unlawfully, or used in a way that creates risk for users, TikTok, or third parties.",
      "You may also revoke the application's TikTok access at any time through your TikTok account settings."
    ]
  },
  {
    title: "Contact",
    body: ["For questions about these Terms, contact us at: support@bubblewrapfactory.app."]
  }
];

export default function TermsPage() {
  return (
    <div className="bg-radial-premium px-4 py-16 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-4xl">
        <header className="border-b border-white/10 pb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-mint">
            Bubble Wrap Factory
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-titanium">
            These Terms of Service govern your use of Bubble Wrap Factory and its TikTok
            integration.
          </p>
          <p className="mt-6 text-sm text-titanium">Effective date: August 2, 2026</p>
        </header>

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.title} className="premium-border rounded-lg bg-graphite/70 p-6">
              <h2 className="text-xl font-semibold text-white">{section.title}</h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-titanium sm:text-base">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
