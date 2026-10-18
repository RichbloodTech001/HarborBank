import Link from "next/link";
export default function AccessibilityPage() {
  return <main className="section" style={{ maxWidth: 900, margin: "0 auto", minHeight: "70vh" }}>
    <Link className="portal-link" href="/">← HarborBank home</Link>
    <div className="eyebrow" style={{ marginTop: 28 }}>ACCESSIBILITY</div>
    <h1 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", margin: "14px 0" }}>Accessibility statement</h1>
    <p className="portal-subtitle">Our aim is to make the prototype usable across devices and input methods.</p>
    <div className="portal-card" style={{ marginTop: 24 }}>
      <h2>Current approach</h2>
      <p>The interface uses semantic page headings, labels for form controls, visible navigation, responsive layouts, and status messages for key actions. These measures are a starting point and do not establish formal conformance with an accessibility standard.</p>
      <h2>Known limitations</h2>
      <p>The application has not yet received a full assistive-technology audit, keyboard-only review, or independent WCAG conformance assessment. Some visual elements and interactive flows may need further refinement.</p>
      <h2>Feedback</h2>
      <p>If you encounter a barrier, contact the site operator through the contact method published for your deployment and include the page and action involved. Add a monitored accessibility contact before launching publicly.</p>
    </div>
  </main>;
}
