import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Bubble Wrap Factory",
  description: "Privacy Policy for Bubble Wrap Factory and its TikTok integration."
};

const sections = [
  {
    title: "Information We Process",
    body: [
      "Bubble Wrap Factory may process basic TikTok account identifiers, such as account ID, username, display name, and profile information returned by TikTok after you authorize the app.",
      "The application may store OAuth tokens that are necessary to keep you authenticated and to operate features you have authorized."
    ]
  },
  {
    title: "TikTok OAuth",
    body: [
      "Bubble Wrap Factory uses TikTok's official OAuth 2.0 authorization flow. We do not collect, receive, or store your TikTok password.",
      "You should only enter TikTok credentials on TikTok-owned authorization pages."
    ]
  },
  {
    title: "Content Posting",
    body: [
      "Bubble Wrap Factory uses the TikTok Content Posting API to publish content only after you authorize the application to do so.",
      "We use your data only to authenticate your account, operate the application, and perform actions you request or authorize."
    ]
  },
  {
    title: "Data Sharing and Sale",
    body: [
      "Bubble Wrap Factory does not sell personal data.",
      "We do not use TikTok account data for advertising resale, data brokerage, or unrelated profiling."
    ]
  },
  {
    title: "Retention and Security",
    body: [
      "OAuth tokens and related account identifiers may be retained for as long as needed to provide the service, comply with legal obligations, resolve disputes, or prevent abuse.",
      "We use reasonable technical and organizational safeguards to protect stored authentication data."
    ]
  },
  {
    title: "Revoking Access",
    body: [
      "You can revoke Bubble Wrap Factory's access at any time through your TikTok account settings or any authorization controls provided by TikTok.",
      "After access is revoked, the application will no longer be able to perform authorized TikTok actions for your account."
    ]
  },
  {
    title: "Contact",
    body: [
      "For privacy questions or data requests, contact us at: support@bubblewrapfactory.app."
    ]
  }
];

export default function PrivacyPage() {
  return (
    <div className="bg-radial-premium px-4 py-16 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-4xl">
        <header className="border-b border-white/10 pb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-mint">
            Bubble Wrap Factory
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Privacy Policy</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-titanium">
            This Privacy Policy explains how Bubble Wrap Factory handles information when you
            connect and use the application with TikTok.
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
