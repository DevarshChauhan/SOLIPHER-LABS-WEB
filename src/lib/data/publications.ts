// Only list a manuscript with a status that can be checked. "Under review"
// means it was actually submitted and the journal has it; anything not yet
// submitted is "In preparation" with no venue named. Add a DOI and PDF link
// only once the paper is published, never before.
export type PublicationStatus = "under-review" | "in-preparation" | "published";

export interface Publication {
  slug: string;
  title: string;
  authors: string[];
  affiliation: string;
  status: PublicationStatus;
  statusLabel: string;
  venue?: string;
  articleType: string;
  abstract: string;
  keywords: string[];
  links: { label: string; href: string }[];
  researchSlug?: string;
}

export const publications: Publication[] = [
  {
    slug: "prism-cvm",
    title:
      "Host-Side Ransomware Detection for AMD SEV-SNP and Intel TDX Confidential Virtual Machines Using Block I/O Request Metadata",
    authors: ["Devarsh Rajendra Chauhan"],
    affiliation: "Department of Information Technology, Shantilal Shah Engineering College, Bhavnagar, India",
    status: "under-review",
    statusLabel: "Under review",
    venue: "SN Computer Science (Springer Nature), submitted October 2026",
    articleType: "Original Research",
    abstract:
      "Confidential virtual machines on AMD SEV-SNP and Intel TDX hide guest memory from the hypervisor, removing the view that hypervisor-level malware detectors rely on. The paper asks whether the disk-request metadata the host must still serve (address, size, direction, time) is enough to detect ransomware. Gradient-boosted trees on storage-only features, evaluated on the hypervisor-recorded RanSMAP dataset with run-disjoint splits, reach AUROC 0.981 on the same hardware and 0.966 on unseen hardware, level with intrusive memory features and better on the unseen machine. Held-out ransomware families and benign programs remain open problems, and the dataset authors' published F-scores are not beaten.",
    keywords: ["confidential computing", "ransomware detection", "AMD SEV-SNP", "Intel TDX"],
    links: [{ label: "Results and raw logs", href: "https://github.com/DevarshChauhan/prism-cvm-results" }],
    researchSlug: "prism-cvm",
  },
  {
    slug: "sharp-core",
    title: "SHARP-Core: Sharded Hybrid Admission-Controlled Retrieval Planes for Exact, Priority, and Ordered Access",
    authors: ["Devarsh Rajendra Chauhan"],
    affiliation: "Department of Information Technology, Shantilal Shah Engineering College, Bhavnagar, India",
    status: "in-preparation",
    statusLabel: "In preparation",
    articleType: "Original Research",
    abstract:
      "A C++20 hybrid index exposing exact-match, priority, and ordered-range access as separate planes behind one interface, with a per-shard admission controller that records budget refusals and probe-bound refusals separately and audits every deferred put. Five benchmark campaigns on cloud virtual machines, the last two with paired trials, separate dispatch cost from index cost. The admission test adds 5 to 10 ns per put-heavy operation, and the ordered plane returns large ranges 1.2 to 7 times faster than an STX B+-tree, ALEX and PGM-index, while learned indexes win point and short-range queries. All evidence comes from microbenchmarks.",
    keywords: ["hybrid index", "admission control", "sharded concurrency", "learned indexes"],
    links: [],
    researchSlug: "h-plhf-core",
  },
];
