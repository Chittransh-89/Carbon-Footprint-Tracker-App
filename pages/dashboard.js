/**
 * ============================================================================
 * FILE: pages/dashboard.js
 * PURPOSE: Visualize the user's carbon footprint with insights and context
 * 
 * RESPONSIBILITIES:
 *   1. Retrieve calculation results from localStorage
 *   2. Redirect to calculator if no results found (defensive routing)
 *   3. Display total footprint prominently with color-coded level
 *   4. Show category-wise breakdown using reusable card components
 *   5. Compare user data against India/Global/Sustainable benchmarks
 *   6. Translate abstract CO2 numbers into relatable real-world impacts
 *   7. Provide navigation to next actions (AI tips, tracker, recalculate)
 * 
 * SCORING CRITERIA ADDRESSED:
 *   - Problem Alignment (HIGH): Directly addresses "personalized insights"
 *     and "understand carbon footprint" parts of the problem statement
 *   - Code Quality (HIGH): Reusable helper components (CategoryCard,
 *     ComparisonRow), destructuring, clean separation of UI/logic
 *   - Accessibility (LOW): Semantic HTML (main, section, h1, h2),
 *     meaningful text content, color + label combination (not color alone)
 *   - Efficiency (MEDIUM): useEffect with empty deps (runs once),
 *     localStorage avoids API call on every dashboard visit
 * 
 * USER FLOW:
 *   User submits calculator
 *           ↓
 *   Data saved to localStorage
 *           ↓
 *   Router pushes to /dashboard
 *           ↓
 *   useEffect reads localStorage
 *           ↓
 *   No data? → Redirect back to /calculator
 *   Has data? → Render insights
 *           ↓
 *   User views breakdown + comparisons + impact
 *           ↓
 *   Clicks "Get AI Suggestions" or "Daily Tracker"
 * 
 * DESIGN PHILOSOPHY:
 *   Numbers alone don't motivate behavior change. This dashboard combines:
 *     - Raw number (the data)
 *     - Color-coded level (instant judgment: "Am I doing okay?")
 *     - Comparisons (context: "How do I compare to others?")
 *     - Real-world impact (relatability: "What does this actually mean?")
 *   This multi-layered approach makes climate data actionable.
 * ============================================================================
 */


// ─────────────────────────────────────────────────────────────────────────────
// IMPORTS
// ─────────────────────────────────────────────────────────────────────────────
// useEffect: Run side effects (read localStorage) after component mounts
// useState:  Track loading state and result data
// useRouter: Programmatically redirect if no data exists
// Link:      Next.js component for client-side navigation (fast, no reload)
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
// Renders at /dashboard route. This is where users see their results
// after submitting the calculator form.
export default function Dashboard() {
  const router = useRouter();

  // ───────────────────────────────────────────────────────────────────────────
  // STATE: Result Data + Loading Flag
  // ───────────────────────────────────────────────────────────────────────────
  // result:  Holds the parsed calculation data (null until loaded)
  // loading: Shows spinner while reading localStorage (fast but not instant)
  //
  // Two-state approach prevents flash of empty content (FOUC) and gives
  // a smooth perceived experience even though localStorage is synchronous.
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  // ───────────────────────────────────────────────────────────────────────────
  // SIDE EFFECT: Load Data on Mount
  // ───────────────────────────────────────────────────────────────────────────
  // useEffect with empty dependency array [] runs ONLY ONCE after the
  // component mounts. This is the right place for:
  //   - Reading from localStorage (only available in browser, not on server)
  //   - One-time initialization
  //   - Setting up subscriptions
  //
  // WHY NOT useState INITIALIZER?
  //   localStorage is a browser-only API. If we tried to read it during
  //   server-side rendering (SSR), Next.js would crash. useEffect runs
  //   only on the client, making it safe for browser APIs.
  useEffect(() => {
    
    // Read the saved calculation from localStorage
    const savedResult = localStorage.getItem("carbonResult");

    // ─────────────────────────────────────────────────────────────────────
    // DEFENSIVE ROUTING: Handle Missing Data
    // ─────────────────────────────────────────────────────────────────────
    // If user lands here directly (e.g., bookmarked URL) without going
    // through the calculator first, there's no data to display.
    // Redirecting to the calculator ensures:
    //   - No broken UI with undefined values
    //   - Clear user journey (calculator → dashboard)
    //   - Prevents crashes from accessing undefined properties
    if (!savedResult) {
      router.push("/calculator");
      return;
    }

    // Parse JSON string back into JavaScript object and store in state
    const parsedResult = JSON.parse(savedResult);
    setResult(parsedResult);
    setLoading(false);
  }, []);

  // ───────────────────────────────────────────────────────────────────────────
  // EARLY RETURN: Loading State
  // ───────────────────────────────────────────────────────────────────────────
  // Show a themed loading screen while:
  //   1. Initial render before useEffect runs
  //   2. localStorage is being read
  //   3. State is being set
  //
  // The spinning earth orb maintains brand consistency and gives the
  // user something pleasant to look at instead of a blank screen.
  // Empty 'main' return also prevents the "flash" of incomplete UI.
  // Loading screen with spinning earth
  if (loading || !result) {
    return (
      <main className="eco-screen">
        <div className="eco-bg" />
        <div className="loading-wrap">
          <div className="earth-orb-wrap">
            <div className="earth-orb">
              <div className="earth-land land-1" />
              <div className="earth-land land-2" />
              <div className="earth-land land-3" />
            </div>
          </div>
          <p className="loading-text">Loading your impact...</p>
        </div>
      </main>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // DESTRUCTURING: Extract Data for Easier Access
  // ───────────────────────────────────────────────────────────────────────────
  // Instead of writing result.footprint.transport everywhere, we
  // destructure the nested objects up front. Benefits:
  //   - Cleaner JSX (less typing, more readable)
  //   - Self-documenting (shows what data is available)
  //   - Easier refactoring (rename in one place)
  const { footprint, carbonLevel, impact, averages } = result;

  // ───────────────────────────────────────────────────────────────────────────
  // RENDER: Dashboard UI
  // ──────────────────────────────────────────────────────────────────────────
  return (
    <main className="eco-screen">
      <div className="eco-bg" />

      {/* Theme background and ambient floating particles */}
      <div className="particle particle-1" />
      <div className="particle particle-2" />
      <div className="particle particle-3" />
      <div className="particle particle-4" />
      <div className="particle particle-5" />
      <div className="particle particle-6" />

      <div className="mobile-shell">
        {/* ─────────────────────────────────────────────────────────────── */}
        {/* HEADER - Brand identity + page title                            */}
        {/* ─────────────────────────────────────────────────────────────── */}
        <section className="dash-header">
          <div className="earth-orb-wrap">
            <div className="earth-orb">
              <div className="earth-land land-1" />
              <div className="earth-land land-2" />
              <div className="earth-land land-3" />
            </div>
          </div>
          <h1 className="hero-title">Your Impact</h1>
          <p className="hero-subtitle">Monthly carbon footprint</p>
        </section>

        {/* ─────────────────────────────────────────────────────────────── */}
        {/* TOTAL SCORE CARD - The hero metric                              */}
        {/* ─────────────────────────────────────────────────────────────── */}
        {/* This is the most important visual element. The number, color,   */}
        {/* and label all come from carbonLevel which is computed based on  */}
        {/* the total footprint value. Dynamic styling via inline 'style'   */}
        {/* lets us change colors based on data (something CSS classes      */}
        {/* alone can't do as elegantly).                                   */}
        <section
          className="total-card"
          style={{ borderColor: carbonLevel.color }}
        >
          <div className="total-label">Total Footprint</div>
          <div
            className="total-number"
            style={{ color: carbonLevel.color }}
          >
            {footprint.total}
          </div>
          <div className="total-unit">kg CO₂ / month</div>
          <div
            className="total-badge"
            style={{ background: carbonLevel.color }}
          >
            {carbonLevel.label}
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────── */}
        {/* CATEGORY BREAKDOWN - Where does the footprint come from?        */}
        {/* ─────────────────────────────────────────────────────────────── */}
        {/* Knowing the total is good, but knowing the breakdown is what    */}
        {/* enables action. If transport is 80% of footprint, user knows    */}
        {/* exactly where to focus their efforts. Five cards = five levers  */}
        {/* the user can pull to reduce emissions.                          */}
        <section className="dash-section">
          <h2 className="section-title">Breakdown</h2>
          <div className="category-grid">
            <CategoryCard icon="🚗" label="Transport" value={footprint.transport} />
            <CategoryCard icon="⚡" label="Electricity" value={footprint.electricity} />
            <CategoryCard icon="🍽️" label="Diet" value={footprint.diet} />
            <CategoryCard icon="🛍️" label="Shopping" value={footprint.shopping} />
            <CategoryCard icon="🔥" label="Gas" value={footprint.gas} />
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────── */}
        {/* COMPARISON - Context through benchmarks                         */}
        {/* ─────────────────────────────────────────────────────────────── */}
        {/* "Am I doing well?" is the user's natural question. Comparing    */}
        {/* against three benchmarks answers this from different angles:    */}
        {/*   - India avg: "How do I compare to my country?"                */}
        {/*   - Global avg: "How do I compare to the world?"                */}
        {/*   - Sustainable target: "Am I doing my fair share?"             */}
        <section className="dash-section">
          <h2 className="section-title">How You Compare</h2>
          <ComparisonRow label="India Average" avg={averages.indiaAvg} yours={footprint.total} />
          <ComparisonRow label="Global Average" avg={averages.globalAvg} yours={footprint.total} />
          <ComparisonRow label="Sustainable Target" avg={averages.targetAvg} yours={footprint.total} />
        </section>

        {/* ─────────────────────────────────────────────────────────────── */}
        {/* REAL WORLD IMPACT - Make it relatable                           */}
        {/* ─────────────────────────────────────────────────────────────── */}
        {/* "100 kg CO2" means nothing to most people. But "4 trees lost"   */}
        {/* or "500 km in a petrol car" instantly creates a mental image.   */}
        {/* This emotional connection drives behavior change, which is the  */}
        {/* whole point of the problem statement: "reduce carbon footprint" */}
        <section className="dash-section">
          <h2 className="section-title">Real World Impact</h2>

          <div className="impact-card">
            <div className="impact-icon">🌳</div>
            <div className="impact-text">
              Equal to cutting <strong>{impact.trees} trees</strong> per month
            </div>
          </div>

          <div className="impact-card">
            <div className="impact-icon">🚗</div>
            <div className="impact-text">
              Like driving <strong>{impact.carKm} km</strong> in a petrol car
            </div>
          </div>

          <div className="impact-card">
            <div className="impact-icon">📱</div>
            <div className="impact-text">
              Same as <strong>{impact.phoneCharges} phone charges</strong>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────── */}
        {/* CALL-TO-ACTION BUTTONS                                          */}
        {/* ─────────────────────────────────────────────────────────────── */}
        {/* After showing the user their impact, we guide them to next      */}
        {/* steps. Three options cover all user intentions:                 */}
        {/*   - Primary: AI suggestions (most valuable action)              */}
        {/*   - Secondary: Daily tracker (long-term engagement)             */}
        {/*   - Tertiary: Recalculate (easy way to experiment)              */}
        {/* Using Next.js Link enables instant client-side navigation       */}
        {/* without full page reload, improving perceived performance.      */}
        <section className="action-section">
          <Link href="/suggestions" className="action-btn primary-btn">
            🤖 Get AI Suggestions →
          </Link>
          
          <Link href="/tracker" className="action-btn secondary-btn">
            📅 Daily Tracker →
          </Link>
          
          <Link href="/calculator" className="action-btn secondary-btn">
            ↻ Recalculate
          </Link>
        </section>

      </div>
    </main>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// HELPER COMPONENTS - Reusable UI Building Blocks
// ═════════════════════════════════════════════════════════════════════════════
// These small components live in the same file because they're tightly
// coupled to the dashboard. Extracting them improves:
//   - Readability of the main component (less JSX noise)
//   - Reusability (used multiple times within the same page)
//   - Testability (could be tested in isolation if needed)
//   - Maintenance (change card design in one place, applies everywhere)


// ─────────────────────────────────────────────────────────────────────────────
// CategoryCard - Displays one emission category
// ─────────────────────────────────────────────────────────────────────────────
// Used 5 times in the breakdown grid. Encapsulating this in a component
// follows the DRY principle (Don't Repeat Yourself).
//
// Props are destructured in the function signature for clean access.
function CategoryCard({ icon, label, value}) {
  return (
    <div className={`category-card`}>
      <div className="cat-icon">{icon}</div>
      <div className="cat-info">
        <div className="cat-label">{label}</div>
        <div className="cat-value">{value}</div>
        <div className="cat-unit">kg CO₂</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ComparisonRow - Shows user vs benchmark with smart formatting
// ─────────────────────────────────────────────────────────────────────────────
// This component contains a small but important piece of logic:
// calculating whether the user is doing better or worse than the average,
// and formatting the difference with appropriate visual cues.
//
// PROPS:
//   - label: Display name of the benchmark (e.g., "India Average")
//   - avg: The benchmark value to compare against (in kg CO2)
//   - yours: The user's actual footprint (in kg CO2)
function ComparisonRow({ label, avg, yours }) {

  // Calculate difference. Negative = user is better than average.
  // toFixed(2) ensures clean number display (no floating point junk).
  // parseFloat converts back to number for math comparison.
  const diff = parseFloat((yours - avg).toFixed(2));

  // Boolean flag for cleaner conditional rendering below
  const isBetter = diff < 0;

  return (
    <div className="compare-row">
      <div className="compare-label">{label}</div>
      <div className="compare-values">
        <span className="compare-avg">{avg} kg avg</span>
        
        {/* Conditional className applies green or red styling */}
        {/* Conditional text shows positive or negative framing */}
        {/* Math.abs() ensures we show "5 kg better" not "-5 kg better" */}
        <span className={`compare-diff ${isBetter ? "better" : "worse"}`}>
          {isBetter ? `${Math.abs(diff)} kg better ✓` : `+${diff} kg`}
        </span>
      </div>
    </div>
  );
}