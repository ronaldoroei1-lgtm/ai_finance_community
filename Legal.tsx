import React from 'react';
// Public legal pages (/terms, /privacy). Always rendered in English, left-to-right,
// inside the regular site header and footer.
export type LegalSlug = 'terms' | 'privacy';
type Section = { heading: string; body: string };
type Doc = { title: string; updated: string; description: string; sections: Section[] };

const CONTACT = 'roei@ai-finance.co.il';
const UPDATED = 'October 17, 2026';

export const LEGAL_DOCS: Record<LegalSlug, Doc> = {
  terms: {
    title: 'AI Finance - Terms of Service',
    updated: UPDATED,
    description: 'Terms of Service for AI Finance and the internal AI Finance Poster tool.',
    sections: [
      { heading: 'About', body: 'AI Finance (ai-finance.co.il) provides practical AI lectures, workshops and courses for finance teams and business owners in Israel. AI Finance Poster is an internal tool used only by AI Finance to publish its own educational content to its own TikTok account.' },
      { heading: 'Use of the tool', body: 'The tool is not offered to the public. Only authorized AI Finance team members may use it, and only to manage AI Finance’s own social media accounts.' },
      { heading: 'Content', body: 'All content published through the tool is created and owned by AI Finance and complies with TikTok’s Terms of Service and Community Guidelines.' },
      { heading: 'Third-party services', body: 'The tool uses the TikTok Content Posting API and Login Kit. Use of TikTok is also subject to TikTok’s own terms.' },
      { heading: 'No warranty', body: 'The tool and the content are provided as is. AI Finance is not liable for any indirect damage arising from their use.' },
      { heading: 'Changes', body: 'AI Finance may update these terms at any time. The updated version will be published at this address.' },
      { heading: 'Contact', body: CONTACT },
    ],
  },
  privacy: {
    title: 'AI Finance - Privacy Policy',
    updated: UPDATED,
    description: 'Privacy Policy for AI Finance and the internal AI Finance Poster tool.',
    sections: [
      { heading: 'Who we are', body: 'AI Finance (ai-finance.co.il) provides practical AI training for finance teams and business owners in Israel. AI Finance Poster is an internal tool used only by AI Finance to publish its own content to its own TikTok account.' },
      { heading: 'What data we access', body: 'When our team connects our TikTok account, the tool receives basic account information (user.info.basic) and permission to upload and publish videos (video.upload, video.publish) to that account only. We do not access, collect or post to any other TikTok user’s account.' },
      { heading: 'How we use it', body: 'The data is used only to confirm which account is connected and to publish videos that AI Finance created.' },
      { heading: 'Storage and sharing', body: 'Access tokens are stored securely by our integration provider and are used only for the purposes above. We do not sell or share any data with third parties.' },
      { heading: 'Deleting data', body: 'Access can be revoked at any time from the TikTok app settings or by contacting us, and we will then delete the related data.' },
      { heading: 'Contact', body: CONTACT },
    ],
  },
};

export const legalSlug = (route: string): LegalSlug | null =>
  route === '/terms' ? 'terms' : route === '/privacy' ? 'privacy' : null;

export default function LegalPage({ slug }: { slug: LegalSlug }) {
  const doc = LEGAL_DOCS[slug];
  return (
    <section className="af-section af-legal" dir="ltr" lang="en">
      <div className="af-wrap">
        <article className="af-prose" style={{ textAlign: 'left', marginInline: 0 }}>
          <h1>{doc.title}</h1>
          <p><em>Last updated: {doc.updated}</em></p>
          <ol>
            {doc.sections.map(s => (
              <li key={s.heading}>
                <strong>{s.heading}:</strong>{' '}
                {s.body === CONTACT ? <a href={`mailto:${CONTACT}`}>{CONTACT}</a> : s.body}
              </li>
            ))}
          </ol>
        </article>
      </div>
    </section>
  );
}
