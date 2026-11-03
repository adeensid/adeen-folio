/**
 * All portfolio content lives here. Edit this file to change the site.
 * Any text that starts with "[" is shown as a dashed placeholder until you replace it.
 */

export type Category = "web" | "mobile" | "ai";

export type Project = {
  id: string;
  name: string;
  mark: string;
  cover: "c1" | "c2" | "c3" | "c4" | "c5" | "c6";
  coverImage?: string;
  cats: Category[];
  kicker: string;
  blurb: string;
  stack: string[];
  challenge: string;
  role: string;
  did: string[];
  outcome: string;
  flow?: string[];
  shot?: string;
  note?: string;
  links: { label: string; href: string }[];
};

export const profile = {
  name: "Adeen Ahmed Siddiqui",
  short: "Adeen",
  location: "Islamabad, Pakistan",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "adeenswork@gmail.com",
  github: "https://github.com/adeensid",
  linkedin: "https://linkedin.com/adeensid",
  status: "Open to junior roles and freelance work",
  headline: "Hi, I'm Adeen. I build products people",
  headlineEm: "actually use.",
  sub: "Full-stack developer from Islamabad. I take a feature from the screen to the API to the database, and add AI where it earns its place.",
};

export const projects: Project[] = [
  {
    id: "shirtify",
    name: "Shirtify",
    mark: "S",
    cover: "c1",
    coverImage: "/img/shirtify-cover.jpg",
    cats: ["web", "ai"],
    kicker: "Final year project · Fall 2025",
    blurb: "An AI-powered store where customers design T-shirts, try them on virtually and shop.",
    stack: ["React", "Node.js", "Express", "MongoDB", "Python", "Flask", "Prophet", "Gemini API", "Fabric.js", "Chart.js"],
    challenge: "Build a custom T-shirt store that uses AI for virtual try-on and for demand forecasting.",
    role: "[Add: solo or team, and the parts you owned]",
    did: [
      "Built a drag-and-drop design editor with Fabric.js and an AI virtual try-on on the Google Gemini Vision API.",
      "Wrote the REST API in Node.js and Express with JWT authentication and MongoDB through Mongoose.",
      "Fixed a checkout race condition by moving stock updates to atomic operations.",
      "Added a Flask microservice that forecasts demand with Facebook Prophet and feeds a hybrid recommendation engine.",
      "Built an admin analytics dashboard in Chart.js.",
    ],
    outcome: "Forecast responses dropped from 8 seconds to under 50 ms with a 24-hour caching layer in MongoDB.",
    flow: ["React + Fabric.js editor", "Express API (JWT)", "MongoDB (atomic stock)", "Flask + Prophet", "24 h cache", "Dashboard"],
    shot: "/img/shirtify.webp",
    links: [{ label: "Code on GitHub", href: "https://github.com/adeensid" }],
  },
  {
    id: "voice-agent",
    name: "Final Expense AI voice agent",
    mark: "V",
    cover: "c2",
    coverImage: "/img/voice-agent.png",
    cats: ["ai"],
    kicker: "Client project · In progress, 2026",
    blurb: "An outbound final expense voice agent with a real-time AI pipeline, compliance guardrails and human handoff.",
    stack: [
      "Python 3.13",
      "FastAPI",
      "Pipecat",
      "OpenAI gpt-5.4-mini",
      "Deepgram",
      "Cartesia",
      "OpenAI embeddings",
      "PostgreSQL 17",
      "pgvector",
      "async SQLAlchemy",
      "Redis",
      "ARQ",
      "MinIO / S3",
      "Telnyx BYOK",
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "Docker Compose",
    ],
    challenge: "Design an outbound final expense voice agent on a live Python and FastAPI platform, with grounded answers, compliance guardrails, and live human handoff.",
    role: "[Frontend & SQA Engineer: Validated an outbound AI voice sales agent end to end, testing the Next.js/React admin and call-review interface and executing scenario, transfer, and compliance test suites to support pilot release]",
    did: [
      "Working from a requirements specification (SRS v2.0). The draft dated 14 October 2026 is with the client for review.",
      "Building on the platform's existing FastAPI and Pipecat stack instead of starting a new one.",
      "Designing the real-time conversation pipeline with Pipecat, Deepgram speech-to-text, OpenAI gpt-5.4-mini and Cartesia text-to-speech.",
      "Planning chunked knowledge retrieval with OpenAI embeddings and PostgreSQL pgvector to ground answers in approved content.",
      "Scoping Telnyx BYOK outbound calls, campaign and API triggers, webhooks, and live transfer to a human agent.",
      "Defining a staged, state-machine conversation flow with AI disclosure, consent-aware handling, opt-out and do-not-call controls, safeguards against unsupported claims, and privacy-focused data minimization.",
      "Planning post-call automated QA and scenario-based validation targeting 100+ conversations and 20+ transfer calls.",
      "Using Python 3.13, async SQLAlchemy, PostgreSQL 17, Redis with ARQ for background jobs, and MinIO or S3-compatible storage.",
      "Planning a Next.js 15, React 19, TypeScript and Tailwind CSS frontend, with Docker Compose, an HTTPS reverse proxy, secrets management, and rollback/versioning for deployment.",
    ],
    outcome: "[Delivered a specification-compliant AI voice agent ready for pilot: staged qualification flow, approved-knowledge answers, live transfer to licensed producers, and automated QA, with a full test plan and release checklist for compliance sign-off.]",
    flow: [
      "Campaign or API trigger",
      "Telnyx outbound call",
      "Pipecat real-time pipeline: Deepgram STT, GPT-5.4-mini, grounded knowledge search, Cartesia TTS",
      "Staged conversation with disclosure, consent-aware guardrails and opt-out handling",
      "Live transfer to a human agent when needed",
      "Post-call QA and scenario-based review",
    ],
    note: "[Check with your client what you may show publicly before adding screenshots or a link]",
    links: [],
  },
  {
    id: "medicine-app",
    name: "Medicine and Appointment Manager",
    mark: "M",
    cover: "c3",
    cats: ["mobile"],
    kicker: "Android app · Academic project",
    blurb: "A native Android app that reminds people about medicines and appointments, offline.",
    stack: ["Java", "Android Studio", "SQLite", "Material Design"],
    challenge: "Remind people about medicines and appointments with all data stored on the device.",
    role: "[Add: solo or team, and the parts you owned]",
    did: [
      "Scheduled reminders with AlarmManager and BroadcastReceiver.",
      "Stored all records locally in SQLite.",
      "Structured the app around Activities with XML layouts that follow Material Design.",
    ],
    outcome: "[Add: devices tested on, or feedback from real users]",
    flow: ["Activity form", "SQLite", "AlarmManager", "BroadcastReceiver", "Reminder shown"],
    shot: "/img/medicine-app.webp",
    links: [{ label: "Code on GitHub", href: "https://github.com/adeensid" }],
  },
  {
    id: "digit-cnn",
    name: "Handwritten Character Recognition",
    mark: "C",
    cover: "c4",
    cats: ["ai"],
    kicker: "Machine learning · Academic project",
    blurb: "A convolutional neural network that recognises handwritten digits from MNIST.",
    stack: ["Python", "TensorFlow", "Keras", "Google Colab", "PIL", "NumPy", "Matplotlib"],
    challenge: "Train a neural network to recognise handwritten digits.",
    role: "[Add: solo or team, and the parts you owned]",
    did: [
      "Trained a CNN on the MNIST dataset with TensorFlow and Keras in Google Colab.",
      "Preprocessed images with PIL, then analysed and charted results with NumPy and Matplotlib.",
    ],
    outcome: "[Add: test accuracy and what you learned]",
    flow: ["MNIST digits", "PIL preprocessing", "CNN (Keras)", "Predicted digit"],
    shot: "/img/digit-cnn.webp",
    links: [{ label: "Code on GitHub", href: "https://github.com/adeensid" }],
  },
  {
    id: "discovery-app",
    name: "Book and movie discovery app",
    mark: "D",
    cover: "c5",
    cats: ["web"],
    kicker: "Web app",
    blurb: "Search for movies or books, browse results from a public API and save favourites on your device.",
    stack: ["React", "Vite", "Tailwind CSS", "TMDB API", "Open Library API", "localStorage"],
    challenge: "Let people find something to watch or read and keep a personal list without creating an account.",
    role: "[Add: solo or team, and the parts you owned]",
    did: [
      "Built the interface in React with Vite and styled it with Tailwind CSS.",
      "Pulls movie data from the TMDB API, or book data from the Open Library API.",
      "Saves favourites in localStorage so the list stays in the browser with no sign-up.",
    ],
    outcome: "[Add: live link, or what you learned]",
    flow: ["Search", "TMDB or Open Library API", "Results", "Favourites in localStorage"],
    shot: "/img/discovery-app.webp",
    links: [{ label: "Code on GitHub", href: "https://github.com/adeensid" }],
  },
  {
    id: "digital-shop",
    name: "Digital products shop",
    mark: "P",
    cover: "c6",
    cats: ["web"],
    kicker: "Web app",
    blurb: "A store for digital goods with product previews, downloads and an order history mockup.",
    stack: ["Next.js", "Tailwind CSS", "Supabase"],
    challenge: "Sell digital products where buyers can preview an item first, then download it after ordering.",
    role: "[Add: solo or team, and the parts you owned]",
    did: [
      "Built the storefront in Next.js with Tailwind CSS.",
      "Added product previews so buyers can see an item before they order.",
      "Added downloads and an order history view, shown as a mockup.",
      "Used Supabase for the backend.",
    ],
    outcome: "[Add: live link, or what you learned]",
    flow: ["Product previews", "Supabase", "Download", "Order history mockup"],
    shot: "/img/digital-shop.webp",
    links: [{ label: "Code on GitHub", href: "https://github.com/adeensid" }],
  },
];

export const filters: { id: "all" | Category; label: string }[] = [
  { id: "all", label: "All" },
  { id: "web", label: "Web" },
  { id: "mobile", label: "Mobile" },
  { id: "ai", label: "AI" },
];

export const services = [
  {
    title: "Full-stack web apps",
    text: "Interfaces, APIs, authentication and data models that work together, including the awkward cases like two people buying the last item.",
    tech: "React · Next.js · Node.js · Supabase",
    icon: "M3 5h18v12H3zM8 21h8M12 17v4",
    project: "shirtify",
  },
  {
    title: "Native Android apps",
    text: "Apps that store data on the device and run scheduled work reliably.",
    tech: "Java · SQLite · Material",
    icon: "M7 3h10v18H7zM11 18h2",
    project: "medicine-app",
  },
  {
    title: "Practical AI features",
    text: "Training a model, serving a forecast or calling a vision API, then making it fast enough to use.",
    tech: "TensorFlow · Prophet · Gemini",
    icon: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18",
    project: "digit-cnn",
  },
  {
    title: "Cloud and delivery",
    text: "Coursework-level experience with servers and CI/CD. This is the area I am growing into.",
    tech: "AWS · Azure · GitHub Actions",
    icon: "M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9a4.5 4.5 0 0 1 0 9z",
    project: null as string | null,
  },
];

export const skills = [
  { group: "Languages", note: "What I write most.", items: ["Java", "Python", "C++", "JavaScript"] },
  { group: "Web", note: "Interfaces and APIs.", items: ["HTML and CSS", "React", "Next.js", "Vite", "TypeScript", "Tailwind CSS", "Node.js", "Express", "REST APIs", "JWT"] },
  { group: "Mobile", note: "Phones and tablets.", items: ["Android (Java, Kotlin)", "Flutter and Dart (basic)"] },
  { group: "AI and data", note: "Models and storage.", items: ["TensorFlow", "Keras", "Prophet", "Gemini API", "MongoDB", "Supabase", "MySQL", "SQLite"] },
  { group: "Cloud and DevOps", note: "From coursework and assignments.", items: ["AWS EC2", "NGINX", "Azure VM and VNet", "GitHub Actions CI/CD", "Cisco Packet Tracer"] },
  { group: "Tools and practice", note: "How I work.", items: ["Git and GitHub", "VS Code", "Android Studio", "Postman", "Vercel", "OOP", "Data structures", "Agile"] },
];

export const experience = [
  {
    when: "Jul to Sep 2025",
    title: "Web Development Intern",
    org: "Empeer DevLab, Islamabad",
    stack: "React · TypeScript · Tailwind CSS · Node.js · MongoDB · JWT · Postman · Vercel",
    extra: "[Add: one sentence on something you built or shipped]" as string | null,
  },
  {
    when: "Sep 2022 to Jul 2026",
    title: "B.S. Software Engineering",
    org: "Capital University of Science and Technology",
    stack: "Cloud computing · Information security · Data structures and algorithms · SDLC and Agile",
    extra: null as string | null,
  },
];

export const contactTypes = ["A job opening", "A freelance project", "An internship", "Something else"] as const;
