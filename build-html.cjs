// Builds a single self-contained roadmap.html for embedding in Duda's HTML widget.
// Content source: roadmap-content.md (kept in sync manually for now).
// Run: node build-html.cjs

const fs = require("fs");

const C = {
  bg: "#FFFFFF",
  bgAlt: "#F6F3FB",
  border: "#E8E0F0",
  text: "#1A1A2E",
  textBody: "#4A4A5A",
  textMuted: "#8A8A9A",
  accent: "#7C5CFC",
  accentLight: "#EDE8FF",
};

const STATUSES = {
  live:        { label: "Live",                color: "#03BF6F", bg: "#E6F9F1" },
  coming:      { label: "Coming Soon",         color: "#0071E8", bg: "#E6F2FF" },
  planned:     { label: "Planned",             color: "#7C5CFC", bg: "#EDE8FF" },
  considering: { label: "Under Consideration", color: "#6B6B7A", bg: "#F4F4F6" },
};

// ─── Content (sourced from roadmap-content.md) ─────────────────────────────
const SECTIONS = [
  {
    title: "Participant Management",
    tagline: "Find, verify, and manage the right people for every study.",
    features: [
      { name: "Pulse Voices™ Panel", status: "live",
        summary: "Access a diverse, vetted panel of 150,000+ users for fast, compliant recruiting.",
        description: "Pulse Voices™ gives you instant access to a diverse, vetted user panel, including 3,000+ AI-focused participants and 2,500+ verified professionals. Three ways to recruit: post your study to the panel directory so qualified members can apply, create external recruitment pages for your own campaigns, or have Pulse search and directly invite participants on your behalf. Many panel members are already ID-verified, and you can require additional verification steps for any study." },
      { name: "Bring Your Own Participants", status: "live",
        summary: "Invite your own users and manage them through the same workflow as panel recruits.",
        description: "Already have a customer list or user base you want to study? Bring them into the Pulse platform and run them through the same workflow as panel recruits: scheduling, consent, data capture, and incentives all in one place." },
      { name: "Recruitment Landing Pages", status: "live",
        summary: "Public landing pages with project info and screener links for your own recruitment campaigns.",
        description: "Run recruitment through your own channels (social, email, partner networks) using branded landing pages that link directly to your screener. Participants who come through these pages create Pulse Voices accounts and join the panel, so the pool grows with every study you run." },
      { name: "Panel Search", status: "coming",
        summary: "Search the Pulse Voices panel yourself using demographics and AI-powered participant insights.",
        description: "Browse and filter the panel by demographics, device usage, profession, and more. AI-powered analysis draws on data from past screeners to surface participants you might not find with demographic filters alone. Currently Pulse runs panel searches on your behalf. This puts the search directly in your hands." },
      { name: "Screener Builder", status: "live",
        summary: "Find exactly the right participants with custom targeting and intelligent screening.",
        description: "Define who qualifies for your study with conditional logic, quotas, and disqualification rules, then let the screener do the work. We specialize in finding hard-to-reach and high-touch audiences, so every participant meets your exact criteria before they are scheduled." },
      { name: "Participant Verification", status: "live",
        summary: "A configurable verification funnel. Enable the checks your study requires.",
        description: "Choose which verification steps participants must pass before entering your study. Options include location verification (check device location against geographic conditions you set), language verification, ID and phone verification via Persona, and custom verification where participants upload images of devices, webpages, or profiles for manual review. Enable any combination to fit your study." },
      { name: "Document Signatures", status: "live",
        summary: "Have participants digitally sign NDAs, consent forms, or participation agreements before they begin.",
        description: "Upload your documents and participants review and sign them digitally via integrated e-signature. Signed documents are securely stored and accessible throughout the project. Use this for IRB consent, NDAs, or any agreement your legal team requires before participants access confidential material." },
      { name: "Participant Messaging", status: "live",
        summary: "A project-scoped chat thread that combines manual messages and automated reminders to participants.",
        description: "Each project has a unified messaging thread for participant communication. Send manual messages directly, or schedule automated reminders for upcoming sessions, screener follow-ups, and incentive notifications — all in one place. Messages reach participants via email today, with SMS delivery coming soon." },
      { name: "Participant Payments", status: "coming",
        summary: "Pay participants directly through the platform when they complete a study.",
        description: "No more juggling gift cards, Venmo requests, or spreadsheet tracking. Incentive payments are built into the study workflow. Participants get paid on completion, and you get a clean record of every transaction." },
      { name: "Private Panels", status: "planned",
        summary: "Recruit once, research many times with a dedicated participant pool.",
        description: "Create an owned panel that persists across studies. Control who is in your pool, how they are segmented, and which studies they can participate in. A reusable research asset for your organization." },
    ],
  },
  {
    title: "Data Capture",
    tagline: "Every methodology your research needs, from structured surveys to naturalistic observation.",
    features: [
      { name: "Surveys", status: "live",
        summary: "Capture targeted, real-world user feedback at any stage of research.",
        description: "Build questionnaires with multiple question types (multiple choice, scales, open-ended, matrix), conditional branching, and randomization. Collect responses asynchronously and review results as they come in." },
      { name: "Evaluations", status: "live",
        summary: "Task-based, directed user research at scale across web, mobile, smart devices, and automotive.",
        description: "You define a set of tasks, participants complete them on their own time while recording their screen and camera. Asynchronous collection means participants engage wherever they are, on their own schedule. Review submissions with synced video playback and transcripts." },
      { name: "Multi-Method Studies", status: "live",
        summary: "Combine multiple data capture methods like surveys, evaluations, and interviews in a single study.",
        description: "Design studies that link multiple capture methods end-to-end. A participant might complete a screener survey, then an evaluation, then a follow-up interview, all with data connected across touchpoints." },
      { name: "Interviews", status: "coming", note: "Available now on managed projects",
        summary: "Live 1:1 and group interviews with multi-camera, on-screen scripts, hidden observers, and auto-transcription.",
        description: "Purpose-built for research, not repurposed video conferencing. Multi-camera support including a companion app, on-screen research scripts so moderators stay on protocol, role-specific views for participants, moderators, and hidden observers, plus real-time note-taking and automatic transcription. Currently available on managed projects run by Pulse. Coming soon for self-service marketplace researchers." },
      { name: "Observations", status: "coming", note: "Available now on managed projects",
        summary: "Capture real behavior with in-situation, naturalistic studies.",
        description: "A rolling recorder runs any time the user engages with a product. When they trigger feedback, they submit video and audio of the experience and the critical moments that led to it. After a one-time setup, users simply use the product and report issues as they naturally happen. Currently available on managed projects. Self-service access coming soon." },
      { name: "App Integrations", status: "coming", note: "Available now on managed projects",
        summary: "Embedded feedback for real-time in-app insights, powered by the FlightRecorder SDK.",
        description: "Integrate the lightweight FlightRecorder SDK to capture feedback directly from within your app. Available across Android, iOS, and Web. Custom in-app surveys, session replay, and real-time insights let participants report bugs, suggest features, and provide contextual feedback without leaving the product." },
      { name: "Rules Engine", status: "coming",
        summary: "Stop managing complex studies in spreadsheets. Automate them visually.",
        description: "Build study logic with a visual drag-and-drop builder. Route participants based on screener responses, trigger follow-up tasks on completion, fork cohorts by criteria, and manage assignments automatically. Your study runs itself instead of living in a Google Sheet." },
      { name: "AI-Moderated Sessions", status: "considering",
        summary: "Qualitative depth at quantitative scale, without a moderator for every session.",
        description: "An AI moderator follows your research protocol to conduct structured interviews, usability sessions, and contextual inquiries at scale. Collect rich, conversational feedback from hundreds of participants without staffing a moderator for each one." },
      { name: "App Store / 3rd Party Tools", status: "planned",
        summary: "An App Store for third-party tools and custom workflows that extend the Pulse platform.",
        description: "A marketplace where third-party developers and partner agencies publish tools and workflows that integrate with Pulse — from custom capture methods to analysis, transcription, and reporting tools. Use the tools you already have, or extend the platform with custom logic for bespoke workflows. The App Store handles distribution, configuration, and billing, so teams can keep the rest of their stack intact and adopt only what helps." },
    ],
  },
  {
    title: "Analysis & Deliverables",
    tagline: "Go from raw sessions to shareable evidence and clear insights.",
    features: [
      { name: "Highlights & Annotations", status: "live",
        summary: "Mark the moments that matter and build your evidence base as you go.",
        description: "Select key passages in transcripts or tag timestamps in recordings to create highlights. Organize them by theme, share with stakeholders, and build a structured evidence base. When it is time to tell the story, the proof is already assembled." },
      { name: "Clips & Reels", status: "live",
        summary: "Pull the best moments from sessions into shareable highlight reels.",
        description: "Extract compelling moments from your sessions into short clips and compile them into highlight reels. A two-minute video lands harder than a fifty-page report." },
      { name: "Export & Reporting", status: "live",
        summary: "Get your data out in the formats your team already uses.",
        description: "Download transcripts, survey data, clips, and annotations as CSV, PDF, MP4, and more. No lock-in, no reformatting. Your research fits into whatever workflow comes next." },
      { name: "Cross-Capture Analysis", status: "considering",
        summary: "All data within a project is linked, so you can pull from different sources into one insight.",
        description: "Data from surveys, evaluations, interviews, and observations within a project is connected at the participant level. Run analysis that pulls a survey response, an interview quote, and a behavioral clip into a single finding without manually cross-referencing spreadsheets." },
      { name: "AI-Assisted Analysis", status: "considering",
        summary: "Automatic video tagging for key events and chat-based search and synthesis across your data.",
        description: "Two core capabilities. First, AI automatically tags video content for key events like confusion, delight, task failure, and feature requests, so you can jump to what matters without watching every session. Second, an agentic chat interface lets you ask questions across your research data and get synthesized answers with source references." },
      { name: "Insight Repository", status: "considering",
        summary: "Institutional research memory, so insights don’t die in slide decks.",
        description: "Search across all past studies to find relevant findings, clips, and annotations. When someone asks “didn’t we research this before?” the answer is findable in seconds, not buried in a Google Drive folder from two years ago." },
      { name: "Integrated Reporting", status: "considering",
        summary: "Build shareable reports where every claim traces back to real evidence.",
        description: "Create polished reports directly from your research data. Every insight links back to the clip, quote, or data point that supports it, so stakeholders can trace the thread from recommendation to evidence. No more copying screenshots into decks and hoping the context survives." },
      { name: "MCP Server", status: "planned",
        summary: "Programmatic access to your research data for analysis, automation, and AI agents.",
        description: "A Model Context Protocol server that exposes your studies, transcripts, clips, survey data, and annotations to external tools and AI assistants. Pull research data into your own analysis environment, run custom synthesis with the LLM of your choice, or wire Pulse into automated workflows. For teams that have invested in their own analysis stack, this means Pulse fits into it rather than replacing it." },
    ],
  },
  {
    title: "Marketplace & Discovery",
    tagline: "How agencies and customers find each other on the Exchange.",
    features: [
      { name: "Agency Storefronts", status: "planned",
        summary: "Build your storefront and showcase your expertise to customers on the Exchange.",
        description: "Agencies build rich profiles highlighting methodology expertise, industry verticals, team bios, and case studies. Customers can evaluate agencies before engaging, cutting down on back-and-forth vetting." },
      { name: "Matching & Recommendations", status: "planned",
        summary: "Find the right research partner faster through algorithmic matching.",
        description: "The Exchange recommends best-fit agencies for each brief based on methodology match, domain expertise, availability, and past performance. A smart shortlist, not a blind marketplace." },
      { name: "Bidding & Proposal Flow", status: "planned",
        summary: "A curated marketplace of research projects matched to your expertise.",
        description: "Customers fill out structured briefs that standardize the information agencies need. Agencies respond with proposals. Customers compare side-by-side on scope, timeline, approach, and price, all within the Exchange.",
        subhead: "Options being explored within this flow, drawn from agency and client interviews:",
        bullets: [
          { lead: "AI-assisted RFP builder", text: " — a conversational flow that asks what the project is about, the team, budget, timeline, and goals, then assembles a structured brief. Clients pick an assisted path when they need something fast or a detailed path when they have time." },
          { lead: "RFP coaching", text: " — if a brief is getting no responses, the platform suggests how to adjust it; best-practice prompts built into the creation flow." },
          { lead: "Tiered bid proposals", text: " — agencies submit good / better / best pricing instead of one flat fee: a base scope plus optional add-ons." },
          { lead: "Bid range visibility", text: " — staged, asymmetric reveal of where a bid falls (e.g. before vs. after submitting), so agencies see if there’s a budget to stay within without exposing their own number." },
          { lead: "Public Q&A on RFPs", text: " — shared questions and answers during an active RFP, visible to all bidders, with the option to keep sensitive threads private." },
          { lead: "Loss reasoning", text: " — when a bid isn’t selected, agencies receive structured feedback on why (pricing, scope fit, timeline, staffing) instead of a silent “not selected.”" },
        ],
      },
      { name: "Ratings & Reviews", status: "considering",
        summary: "Build trust over time with post-project quality ratings from both sides.",
        description: "After each engagement, agencies and customers rate the experience. Over time this builds a trust layer that improves match quality and surfaces top-performing partners. Reputation you earn, not just claim." },
      { name: "Certification & Badges", status: "considering",
        summary: "Verified credentials for methodology expertise and platform training.",
        description: "Earn badges by completing Pulse training modules or demonstrating methodology expertise. Customers see verified credentials when evaluating agencies, giving them confidence before the first conversation." },
    ],
  },
  {
    title: "Project Setup & Collaboration",
    tagline: "Everything between “let’s work together” and kickoff.",
    features: [
      { name: "Scope Agreements", status: "planned",
        summary: "Get aligned on deliverables, timeline, and budget before work begins.",
        description: "Templated scope documents capture everything both parties need to agree on: deliverables, timeline, methodology, and budget. Both sides sign off before work starts, so misalignment surfaces early instead of at the invoice." },
      { name: "In-App Messaging", status: "considering",
        summary: "Keep all project communication in one place instead of scattered across email.",
        description: "Direct messaging between researchers, agencies, and customers, threaded by engagement. No more digging through email chains to find that one attachment or that one decision." },
      { name: "Shared Project Workspace", status: "planned",
        summary: "One place to see what has been delivered, what is in progress, and what is next.",
        description: "A centralized project hub where every stakeholder can track deliverables, timelines, and status in real time. No more status-update meetings to learn what everyone already knows." },
      { name: "Notifications & Alerts", status: "planned",
        summary: "Know when something needs your attention without constantly checking the platform.",
        description: "Configurable alerts for project milestones, new messages, review requests, and status changes, delivered via in-app, email, or Slack." },
      { name: "Billing & Invoicing", status: "coming",
        summary: "Subscription billing, usage-based metering, and milestone-based invoicing for projects on the Exchange.",
        description: "Manage all project-related billing in one place. Monthly subscriptions per seat for customers and agencies, usage-based metering by capture type, and milestone-triggered invoicing for project deliverables. Pre-funded credit balances cover participant incentives, and the platform handles disbursement on completion. Export receipts and invoices for accounting." },
    ],
  },
];

// ─── Escape helpers ────────────────────────────────────────────────────────
const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

// ─── Markup ────────────────────────────────────────────────────────────────
const pill = (status) => {
  const s = STATUSES[status];
  return `<span class="pr-pill" style="background:${s.bg};color:${s.color}">${esc(s.label)}</span>`;
};

const featureHTML = (f) => {
  const noteHTML = f.note ? `<div class="pr-note">${esc(f.note)}</div>` : "";
  const subheadHTML = f.subhead ? `<p class="pr-subhead">${esc(f.subhead)}</p>` : "";
  const bulletsHTML = f.bullets
    ? `<ul class="pr-bullets">${f.bullets
        .map((b) => `<li><strong>${esc(b.lead)}</strong>${esc(b.text)}</li>`)
        .join("")}</ul>`
    : "";
  return `
        <article class="pr-card">
          <div class="pr-card-head">
            <h3 class="pr-card-title">${esc(f.name)}</h3>
            ${pill(f.status)}
          </div>
          ${noteHTML}
          <p class="pr-summary">${esc(f.summary)}</p>
          <p class="pr-desc">${esc(f.description)}</p>
          ${subheadHTML}
          ${bulletsHTML}
        </article>`;
};

const sectionHTML = (s) => `
      <section class="pr-section">
        <header class="pr-section-head">
          <h2 class="pr-section-title">${esc(s.title)}</h2>
          <p class="pr-section-tagline">${esc(s.tagline)}</p>
        </header>
        <div class="pr-cards">
          ${s.features.map(featureHTML).join("")}
        </div>
      </section>`;

const legendItem = (k) =>
  `<span class="pr-legend-item"><span class="pr-pill" style="background:${STATUSES[k].bg};color:${STATUSES[k].color}">${esc(STATUSES[k].label)}</span></span>`;

const html = `<!-- Pulse Public Roadmap — self-contained embed for Duda HTML widget -->
<style>
  .pr-root {
    --pr-bg: ${C.bg};
    --pr-bg-alt: ${C.bgAlt};
    --pr-border: ${C.border};
    --pr-text: ${C.text};
    --pr-body: ${C.textBody};
    --pr-muted: ${C.textMuted};
    --pr-accent: ${C.accent};
    --pr-accent-light: ${C.accentLight};
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: var(--pr-text);
    background: var(--pr-bg);
    line-height: 1.55;
    max-width: 1100px;
    margin: 0 auto;
    padding: 32px 24px 64px;
    box-sizing: border-box;
  }
  .pr-root *, .pr-root *::before, .pr-root *::after { box-sizing: border-box; }
  .pr-header { margin-bottom: 32px; }
  .pr-eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 12px;
    font-weight: 600;
    color: var(--pr-accent);
    margin: 0 0 8px;
  }
  .pr-title {
    font-size: 36px;
    font-weight: 700;
    margin: 0 0 8px;
    line-height: 1.15;
    color: var(--pr-text);
  }
  .pr-lede {
    font-size: 17px;
    color: var(--pr-body);
    margin: 0 0 24px;
    max-width: 720px;
  }
  .pr-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 14px 16px;
    background: var(--pr-bg-alt);
    border: 1px solid var(--pr-border);
    border-radius: 12px;
  }
  .pr-legend-item { display: inline-flex; align-items: center; }
  .pr-section { margin-top: 48px; }
  .pr-section-head {
    border-bottom: 1px solid var(--pr-border);
    padding-bottom: 12px;
    margin-bottom: 20px;
  }
  .pr-section-title {
    font-size: 24px;
    font-weight: 700;
    margin: 0 0 4px;
    color: var(--pr-text);
  }
  .pr-section-tagline {
    margin: 0;
    color: var(--pr-muted);
    font-size: 15px;
    font-style: italic;
  }
  .pr-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 16px;
  }
  .pr-card {
    border: 1px solid var(--pr-border);
    border-radius: 12px;
    padding: 20px 22px;
    background: var(--pr-bg);
    transition: border-color 0.15s ease, transform 0.15s ease;
  }
  .pr-card:hover { border-color: var(--pr-accent); }
  .pr-card-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 6px;
  }
  .pr-card-title {
    font-size: 17px;
    font-weight: 700;
    margin: 0;
    color: var(--pr-text);
    line-height: 1.3;
  }
  .pr-pill {
    display: inline-block;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.02em;
    padding: 3px 10px;
    border-radius: 999px;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .pr-note {
    font-size: 12px;
    font-style: italic;
    color: var(--pr-muted);
    margin: 2px 0 6px;
  }
  .pr-summary {
    font-size: 14px;
    font-weight: 500;
    color: var(--pr-text);
    margin: 0 0 10px;
  }
  .pr-desc {
    font-size: 14px;
    color: var(--pr-body);
    margin: 0;
  }
  .pr-subhead {
    font-size: 14px;
    color: var(--pr-body);
    margin: 14px 0 8px;
    font-weight: 500;
  }
  .pr-bullets {
    margin: 0;
    padding-left: 20px;
    font-size: 14px;
    color: var(--pr-body);
  }
  .pr-bullets li { margin-bottom: 6px; }
  .pr-bullets li strong { color: var(--pr-text); }
  @media (max-width: 640px) {
    .pr-root { padding: 20px 16px 48px; }
    .pr-title { font-size: 28px; }
    .pr-lede { font-size: 16px; }
    .pr-section-title { font-size: 20px; }
    .pr-cards { grid-template-columns: 1fr; }
  }
</style>

<div class="pr-root">
  <header class="pr-header">
    <p class="pr-eyebrow">Public Roadmap</p>
    <h1 class="pr-title">What we&rsquo;re building at Pulse</h1>
    <p class="pr-lede">What we&rsquo;ve shipped, what&rsquo;s next, and what we&rsquo;re weighing. Updated regularly as priorities evolve.</p>
    <div class="pr-legend">
      ${["live","coming","planned","considering"].map(legendItem).join("\n      ")}
    </div>
  </header>
  ${SECTIONS.map(sectionHTML).join("\n  ")}
</div>
`;

fs.writeFileSync("roadmap-embed.html", html);
console.log("Wrote roadmap-embed.html (" + html.length + " bytes)");
