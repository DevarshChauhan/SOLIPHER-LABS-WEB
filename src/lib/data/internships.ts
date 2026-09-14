// Paste the Google Form URL here to point every "Apply Now" button on the
// internship pages at it. While this is empty, those buttons fall back to a
// prefilled email to the address in site.ts, so no link is ever dead.
export const applyFormUrl = "";

export interface InternshipProject {
  title: string;
  description: string;
}

export interface InternshipDomain {
  slug: string;
  name: string;
  navLabel: string;
  summary: string;
  heroDescription: string;
  overview: string[];
  stack: string[];
  projects: InternshipProject[];
  outcomes: string[];
}

export const internshipDomains: InternshipDomain[] = [
  {
    slug: "web-development",
    name: "Web Development",
    navLabel: "Web Development",
    summary: "Build and ship real web applications, front end through deployment.",
    heroDescription:
      "Learn web development by building applications that actually go live, not by following along with a tutorial that ends at localhost.",
    overview: [
      "Web development is the widest entry point into software, and the one where the gap between a tutorial project and a production application is largest. This track exists to close that gap: you build real features, handle real edge cases, and put what you build somewhere a stranger can open it.",
      "You work the same way our engineers do, in a Git branch, through code review, into a deployment. By the end you have a URL you can send someone, and you can explain every decision behind what is at the other end of it.",
    ],
    stack: ["HTML, CSS & modern JavaScript", "React & Next.js", "Node.js and REST APIs", "Databases & data modelling", "Git and pull-request review", "Deployment and CI/CD"],
    projects: [
      {
        title: "A responsive multi-page application",
        description: "A complete front end that holds up on a phone as well as a desktop, built from a design rather than improvised as you go.",
      },
      {
        title: "An authenticated CRUD dashboard",
        description: "Login, permissions, and full create/read/update/delete against a real database, with the failure cases handled rather than ignored.",
      },
      {
        title: "A deployed, API-backed feature",
        description: "One feature taken all the way from data model to a live deployment, with an automated pipeline shipping it.",
      },
    ],
    outcomes: ["A live URL you can put on a CV", "Code that has been through real review", "A working Git and deployment workflow", "The ability to explain your own architecture"],
  },
  {
    slug: "android-app-development",
    name: "Android App Development",
    navLabel: "Android App Development",
    summary: "Build native Android applications, from first screen to a working build.",
    heroDescription:
      "Native Android development in Kotlin, building apps that handle real devices, real network conditions, and real users, not just the emulator.",
    overview: [
      "Mobile is where careless assumptions get punished fastest: the network drops, the process gets killed, the screen is a different size than the one you tested on. This track teaches you to build for that reality from the start.",
      "You build in Kotlin with modern Android tooling, structure your app so it survives a rotation and a lost connection, and finish with a signed build you can install on an actual phone and hand to someone.",
    ],
    stack: ["Kotlin", "Android Studio & the Android SDK", "Jetpack Compose", "Room / local persistence", "REST API integration", "Material Design"],
    projects: [
      {
        title: "A multi-screen app with real navigation",
        description: "Proper navigation, state that survives configuration changes, and a layout that works across screen sizes.",
      },
      {
        title: "An offline-first application",
        description: "Local persistence that keeps the app usable with no connection, and syncs correctly once the connection returns.",
      },
      {
        title: "An API-integrated feature with error handling",
        description: "Live data from a real API, with loading, empty, and failure states designed rather than left to crash.",
      },
    ],
    outcomes: ["An installable app you built yourself", "Kotlin and Jetpack Compose in practice", "Offline and error handling done properly", "A published or shareable build"],
  },
  {
    slug: "python-programming",
    name: "Python Programming",
    navLabel: "Python Programming",
    summary: "Write Python that solves real problems and holds up under a test suite.",
    heroDescription:
      "Python from the fundamentals through to tooling that people actually use in production: tested, packaged, and readable by someone other than you.",
    overview: [
      "Almost everyone can write a Python script. Far fewer can write Python that another engineer can pick up, trust, and change six months later. That difference is what this track is about.",
      "You work through the language properly, then build real tools with it: automation, data processing, and command-line programs, each one covered by tests that prove it works rather than a claim that it does.",
    ],
    stack: ["Python 3 and the standard library", "Virtual environments & packaging", "pandas and NumPy", "requests and API consumption", "pytest and test-driven work", "Debugging and profiling"],
    projects: [
      {
        title: "A command-line tool other people can run",
        description: "A properly argument-parsed CLI with sensible errors, documentation, and an installable package.",
      },
      {
        title: "An automation script that removes real manual work",
        description: "Something genuinely tedious, automated end to end, with the edge cases that break naive scripts handled.",
      },
      {
        title: "A tested data-processing pipeline",
        description: "Ingest, transform, and output a real dataset, with a test suite that catches the regressions you would otherwise ship.",
      },
    ],
    outcomes: ["Python beyond tutorial level", "A real test suite you wrote", "Packaging and environment discipline", "Tools someone else can actually run"],
  },
  {
    slug: "java-programming",
    name: "Java Programming",
    navLabel: "Java Programming",
    summary: "Object-oriented design in Java, built and tested the way real teams do it.",
    heroDescription:
      "Java as it is actually used: real object-oriented design, a build tool, a test suite, and a database behind it.",
    overview: [
      "Java rewards structure and punishes improvisation, which makes it one of the best languages to learn design discipline in. This track focuses on that: modelling a problem properly before writing the class that solves it.",
      "You work with modern Java, a real build tool, and JUnit, and you finish having designed something non-trivial rather than having completed a sequence of exercises.",
    ],
    stack: ["Modern Java (17+)", "Object-oriented design", "Collections and generics", "JDBC and database access", "Maven or Gradle", "JUnit testing"],
    projects: [
      {
        title: "A properly modelled domain",
        description: "A real problem modelled in classes and interfaces, where the design choices are deliberate and you can defend them.",
      },
      {
        title: "A database-backed application",
        description: "Persistent storage through JDBC, with transactions and error handling that survive things going wrong mid-operation.",
      },
      {
        title: "A unit-tested, buildable library",
        description: "A reusable component with a real build configuration and a JUnit suite covering its actual behaviour.",
      },
    ],
    outcomes: ["Object-oriented design you can justify", "A JUnit suite covering real behaviour", "Working Maven/Gradle build skills", "Database access done safely"],
  },
  {
    slug: "cpp-programming",
    name: "C++ Programming",
    navLabel: "C++ Programming",
    summary: "Systems-level C++, where memory and performance are yours to manage.",
    heroDescription:
      "Modern C++ close to the metal: memory you manage, data structures you implement yourself, and performance you measure rather than assume.",
    overview: [
      "C++ is where you stop being able to hand-wave about what the machine is doing. Memory, ownership, and cost become explicit, which is exactly why it is worth learning properly.",
      "This track sits closest to the work Solipher Labs does on its own products. You implement data structures from scratch, profile what you wrote, and learn to tell the difference between code that feels fast and code that measures fast.",
    ],
    stack: ["Modern C++ (17/20)", "Pointers, references & ownership", "The STL", "CMake", "gdb and valgrind", "Benchmarking and profiling"],
    projects: [
      {
        title: "A data structure implemented from scratch",
        description: "Built without leaning on the STL for the core, so you understand the cost of every operation you expose.",
      },
      {
        title: "A memory-clean program, proven",
        description: "A non-trivial program taken through valgrind until it is genuinely leak-free, not assumed to be.",
      },
      {
        title: "A benchmarked algorithm comparison",
        description: "Two approaches to the same problem, measured on real input, with a result you can explain rather than guess at.",
      },
    ],
    outcomes: ["Real understanding of memory and ownership", "A data structure you built yourself", "Profiling and benchmarking skills", "Measured results, not assumed ones"],
  },
  {
    slug: "artificial-intelligence",
    name: "Artificial Intelligence",
    navLabel: "Artificial Intelligence",
    summary: "Build AI systems, and learn to test whether they actually work.",
    heroDescription:
      "Applied AI: building systems on top of models, and, just as importantly, building the evaluation that tells you whether they are any good.",
    overview: [
      "The hard part of AI work is rarely getting a model to produce output. It is knowing whether that output is correct, and catching it when it quietly stops being correct.",
      "This track covers both halves: you build real AI-backed features, and you build the evaluation harness that measures them. That second half is what separates a demo from something anyone would deploy.",
    ],
    stack: ["Python for AI work", "Search and classical AI techniques", "LLM APIs and prompt design", "Retrieval-augmented generation", "Evaluation harness design", "NumPy"],
    projects: [
      {
        title: "A problem-solving agent",
        description: "Search and heuristics applied to a real problem, where you can explain why it finds the answer it finds.",
      },
      {
        title: "A retrieval-backed assistant",
        description: "An assistant grounded in a real document set, that cites what it used rather than inventing an answer.",
      },
      {
        title: "An evaluation harness with real numbers",
        description: "A measurement setup that scores your own system honestly, including the cases where it fails.",
      },
    ],
    outcomes: ["AI systems you built, not just called", "Evaluation you can defend", "Prompt and retrieval design in practice", "An honest read on model limitations"],
  },
  {
    slug: "machine-learning",
    name: "Machine Learning",
    navLabel: "Machine Learning",
    summary: "Train models end to end, and evaluate them like results matter.",
    heroDescription:
      "The full machine learning pipeline, from messy raw data to a trained model and an evaluation that survives scrutiny.",
    overview: [
      "A model with 99% accuracy on an imbalanced dataset can be completely useless, and plenty of projects ship exactly that. This track teaches you to spot it.",
      "You take real, imperfect data through the whole pipeline: cleaning, features, training, and an evaluation that reports the metrics that actually matter for the problem rather than the one that looks best.",
    ],
    stack: ["Python, pandas & NumPy", "scikit-learn", "Feature engineering", "Model evaluation & validation", "PyTorch fundamentals", "matplotlib visualisation"],
    projects: [
      {
        title: "An end-to-end supervised model",
        description: "Raw data through cleaning, features, training, and validation, with the choices at each step deliberate.",
      },
      {
        title: "A feature engineering study",
        description: "A measured comparison showing what your features actually contributed, rather than assuming they helped.",
      },
      {
        title: "An honest evaluation report",
        description: "Precision, recall, and the confusion matrix, including a clear statement of where the model fails.",
      },
    ],
    outcomes: ["A trained model with a real evaluation", "Feature engineering you can justify", "Metric literacy beyond accuracy", "A reproducible training pipeline"],
  },
  {
    slug: "data-science",
    name: "Data Science",
    navLabel: "Data Science",
    summary: "Turn messy real data into findings someone can act on.",
    heroDescription:
      "Working with real data: messy, incomplete, and inconsistent, and getting to a finding that holds up when someone questions it.",
    overview: [
      "Clean datasets are a teaching fiction. Real data has missing fields, duplicated rows, and columns that mean something different than their name suggests. This track starts there.",
      "You learn to explore data properly, query it with SQL, visualise it without misleading anyone, and present a conclusion you can still defend when someone pushes back on it.",
    ],
    stack: ["Python, pandas & NumPy", "SQL", "Exploratory data analysis", "matplotlib & seaborn", "Statistical reasoning", "Jupyter notebooks"],
    projects: [
      {
        title: "An exploratory analysis of a messy dataset",
        description: "Real data cleaned and explored, with every assumption you made about it written down.",
      },
      {
        title: "A SQL-driven investigation",
        description: "A question answered by querying a real database, including the joins and aggregations that get you there.",
      },
      {
        title: "A findings report with honest visuals",
        description: "Charts that represent the data fairly and a conclusion that states its own limitations.",
      },
    ],
    outcomes: ["Practical pandas and SQL", "Analysis on genuinely messy data", "Visualisation that doesn't mislead", "A defensible written finding"],
  },
  {
    slug: "cloud-computing",
    name: "Cloud Computing",
    navLabel: "Cloud Computing",
    summary: "Deploy, containerize, and operate applications that stay up.",
    heroDescription:
      "The infrastructure side: containers, pipelines, and deployments, plus the monitoring that tells you when something has gone wrong.",
    overview: [
      "Writing an application and keeping it running are different skills, and the second one is in short supply. This track is about the second one.",
      "You work in Linux, containerize real applications, build the pipeline that ships them, and set up the monitoring that means you find out about a failure before a user reports it.",
    ],
    stack: ["Linux & the command line", "Docker & containerization", "AWS / GCP fundamentals", "CI/CD pipelines", "Nginx & reverse proxies", "Monitoring and logging"],
    projects: [
      {
        title: "A containerized application",
        description: "A real application packaged into a container that runs identically on your machine and on a server.",
      },
      {
        title: "An automated deployment pipeline",
        description: "Commit to deployment without anyone touching a server by hand, including a rollback path.",
      },
      {
        title: "A monitored production deployment",
        description: "A live deployment with logging and alerting, so failures surface on their own.",
      },
    ],
    outcomes: ["Docker and Linux in real use", "A CI/CD pipeline you built", "A live, monitored deployment", "Incident-response fundamentals"],
  },
  {
    slug: "ui-ux-design",
    name: "UI/UX Design",
    navLabel: "UI/UX Design",
    summary: "Design interfaces that work, then hand them off so they get built right.",
    heroDescription:
      "Interface design grounded in how people actually use software, taken through to a handoff an engineer can build from without guessing.",
    overview: [
      "A design that looks good in a portfolio and a design that survives being built are not the same artifact. The difference is usually in the states nobody drew: empty, loading, error, too much text.",
      "This track covers the full arc, research through handoff, including the unglamorous parts that decide whether the thing that ships resembles what you designed.",
    ],
    stack: ["Figma", "User flows & wireframing", "Design systems & components", "Interactive prototyping", "Accessibility (WCAG)", "Developer handoff"],
    projects: [
      {
        title: "A full flow, wireframe to high fidelity",
        description: "One real user journey designed properly, including the empty, loading, and error states.",
      },
      {
        title: "A reusable design system",
        description: "Components and tokens consistent enough that someone else can design a new screen with them.",
      },
      {
        title: "An accessible, engineer-ready handoff",
        description: "A design that meets contrast and accessibility standards, specced so it can be built without follow-up questions.",
      },
    ],
    outcomes: ["A portfolio-ready case study", "A design system you built", "Accessibility as a default habit", "Handoff skills engineers appreciate"],
  },
  {
    slug: "digital-marketing",
    name: "Digital Marketing",
    navLabel: "Digital Marketing",
    summary: "Run campaigns you can measure, not campaigns you can only describe.",
    heroDescription:
      "Digital marketing held to the same standard as everything else here: every campaign reports a real number, not an impression count that flatters it.",
    overview: [
      "Marketing generates more unfalsifiable claims than any other function in a company. This track takes the opposite position: if you cannot measure it, do not claim it.",
      "You learn SEO, content, email, and paid channels, and you learn to instrument them, so that at the end of a campaign you can say what it actually produced rather than how busy it looked.",
    ],
    stack: ["SEO & technical audits", "Analytics & conversion tracking", "Content strategy", "Email marketing", "Paid & social campaigns", "Landing page optimisation"],
    projects: [
      {
        title: "A technical SEO audit",
        description: "A real site audited for the issues actually suppressing it, prioritised by impact rather than listed at random.",
      },
      {
        title: "A fully instrumented campaign",
        description: "A campaign with tracking set up before launch, so the result is measured rather than estimated afterwards.",
      },
      {
        title: "A funnel analysis with a real conclusion",
        description: "Traffic through to conversion, with the drop-off identified and a specific recommendation attached.",
      },
    ],
    outcomes: ["Analytics and tracking set up properly", "A campaign with measured results", "SEO skills that survive an audit", "Reporting that states real numbers"],
  },
];

export function getInternshipDomain(slug: string): InternshipDomain | undefined {
  return internshipDomains.find((d) => d.slug === slug);
}

export const internshipNavLinks = [
  ...internshipDomains.map((d) => ({ href: `/internships/${d.slug}`, label: d.navLabel })),
  { href: "/internships", label: "All Internships" },
] as const;
