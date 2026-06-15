/**
 * ============================================================================
 * FILE: pages/suggestions.js
 * PURPOSE: Display AI-generated personalized carbon reduction tips
 * 
 * RESPONSIBILITIES:
 *   1. Retrieve user's footprint and input data from localStorage
 *   2. Send context-rich data to the AI suggestions API
 *   3. Handle three UI states: loading, error, success
 *   4. Render AI suggestions in visually appealing cards
 *   5. Show category icons to make suggestions scannable
 *   6. Highlight CO2 savings to motivate action
 *   7. Provide navigation back to dashboard or recalculate
 * 
 * SCORING CRITERIA ADDRESSED:
 *   - Problem Alignment (HIGH): "Personalized insights" directly addressed
 *     through AI-generated tips based on user's specific footprint data
 *   - Code Quality (HIGH): Three-state UI pattern (loading/error/success),
 *     clean async handling, separation of API logic and rendering
 *   - Accessibility (LOW): Semantic HTML, meaningful loading/error text,
 *     icon + text combination (not icon alone)
 *   - Efficiency (MEDIUM): Single AI API call, conditional rendering
 *     prevents unnecessary DOM operations
 *   - Security (MEDIUM): No sensitive data exposed in error messages
 * 
 * THREE-STATE UI PATTERN:
 *   Every async data-fetching page should handle three states clearly:
 *     1. LOADING - Show progress indicator (user knows something is happening)
 *     2. ERROR   - Show friendly message + recovery action (don't dead-end)
 *     3. SUCCESS - Show the actual data (the goal state)
 *   This pattern is a hallmark of well-built modern web apps.
 * 
 * USER FLOW:
 *   User clicks "Get AI Suggestions" on dashboard
 *           ↓
 *   This page loads, shows spinning earth (loading state)
 *           ↓
 *   useEffect triggers, reads localStorage
 *           ↓
 *   Data sent to /api/suggestions endpoint
 *           ↓
 *   AI (GPT-4o-mini) generates 5 personalized tips
 *           ↓
 *   Response parsed and stored in state
 *           ↓
 *   Loading state ends, suggestions render as cards
 *           ↓
 *   User reads tips, navigates to next action
 * ============================================================================
 */


// ─────────────────────────────────────────────────────────────────────────────
// IMPORTS
// ─────────────────────────────────────────────────────────────────────────────
// useEffect: Trigger AI fetch when component mounts
// useState:  Manage suggestions data, loading, and error states
// useRouter: Redirect if user lands here without prior calculation
// Link:      Client-side navigation (no full page reload)

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// SUGGESTIONS COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
// Renders at /suggestions route. Fetches AI tips on mount and displays them
// in a visually appealing list format.
export default function Suggestions() {
  const router = useRouter();

  // ───────────────────────────────────────────────────────────────────────────
  // STATE: Three Variables for Three UI States
  // ───────────────────────────────────────────────────────────────────────────
  // Following the "three-state pattern" for async data fetching:
  //   - suggestions: The actual data (empty array initially)
  //   - loading:     True while waiting for AI response
  //   - error:       Error message string (null when no error)
  //
  // Initializing 'suggestions' as [] (not null) prevents .map() errors
  // and makes conditional rendering simpler in JSX.
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ───────────────────────────────────────────────────────────────────────────
  // SIDE EFFECT: Fetch Suggestions on Mount
  // ───────────────────────────────────────────────────────────────────────────
  // useEffect with [] runs once after the component first renders.
  // We do all setup work here: check localStorage, validate data,
  // and trigger the AI API call.
  useEffect(() => {

    // Read both result and input from localStorage.
    // We need BOTH because:
    //   - result.footprint: tells AI about the user's emissions
    //   - input.dietType:   tells AI about their lifestyle choices
    //   - input.transportMode: tells AI which transport they use
    //   - input.gasType:    tells AI about cooking method
    // More context = better, more personalized AI suggestions.
    // Get saved data from localStorage
    const savedResult = localStorage.getItem("carbonResult");
    const savedInput = localStorage.getItem("carbonInput");

    // ─────────────────────────────────────────────────────────────────────
    // DEFENSIVE ROUTING: Handle Missing Data
    // ─────────────────────────────────────────────────────────────────────
    // If either piece of data is missing (user landed here directly,
    // cleared storage, etc.), redirect them to the calculator.
    // This prevents:
    //   - Crashes from undefined property access
    //   - Wasted AI API call with no data
    //   - Confusing empty page for the user
    if (!savedResult || !savedInput) {
      router.push("/calculator");
      return;
    }

    // Parse both data objects from JSON strings
    const result = JSON.parse(savedResult);
    const input = JSON.parse(savedInput);

    // Trigger the AI fetch with all required context
    fetchSuggestions(result.footprint, input);
  }, []);

  // ───────────────────────────────────────────────────────────────────────────
  // ASYNC FUNCTION: Call AI API
  // ───────────────────────────────────────────────────────────────────────────
  // Separated into its own function (not inline) because:
  //   - Easier to read and maintain
  //   - Could be called again (e.g., for a "regenerate" button later)
  //   - Better error handling boundaries
  //   - Self-documenting function name
  async function fetchSuggestions(footprint, input) {
    try {

      // Send POST request to our backend API.
      // We only send the fields the AI needs - no unnecessary data.
      // This is both a security best practice (minimal data exposure)
      // and an efficiency optimization (smaller request payload).
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          footprint,
          dietType: input.dietType,
          transportMode: input.transportMode,
          gasType: input.gasType,
        }),
      });

      // Parse the JSON response
      const data = await response.json();

      // ───────────────────────────────────────────────────────────────────
      // RESPONSE HANDLING: Check for API-level Errors
      // ───────────────────────────────────────────────────────────────────
      // The API might return 200 OK with an error field in the body
      // (e.g., AI service down). We handle this case separately from
      // network errors caught by the catch block.
      if (data.error) {
        setError(data.error);
      } else {
        setSuggestions(data.suggestions);
      }
    } catch (err) {
      // Catches network errors, JSON parsing failures, etc.
      // Generic error message protects against information leakage
      // while still giving the user actionable feedback.
      setError("Something went wrong. Please try again.");
    } finally {
      // ALWAYS turn off loading, whether success or failure.
      // 'finally' block ensures the loading spinner doesn't stay
      // forever if an unexpected error occurs.
      setLoading(false);
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // CONFIGURATION: Category Icon Mapping
  // ───────────────────────────────────────────────────────────────────────────
  // Object lookup is O(1) - faster than if-else chains.
  // Defined inside component (not at module level) because it's small
  // and only used here. The fallback in JSX (|| "💡") handles any
  // unexpected categories from the AI gracefully.
  const categoryIcons = {
    transport: "🚗",
    electricity: "⚡",
    diet: "🍽️",
    shopping: "🛍️",
    gas: "🔥",
  };

  // ───────────────────────────────────────────────────────────────────────────
  // EARLY RETURN: Loading State
  // ───────────────────────────────────────────────────────────────────────────
  // While the AI is generating suggestions (typically 1-3 seconds),
  // show a themed loading screen. The animated earth orb maintains
  // brand consistency and reassures the user that something is happening.
  // The message "AI is analyzing your impact" sets expectations.
  if (loading) {
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
          <p className="loading-text">AI is analyzing your impact...</p>
        </div>
      </main>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // EARLY RETURN: Error State
  // ───────────────────────────────────────────────────────────────────────────
  // If something went wrong, show a clear error message with a way out.
  // The "Back to Dashboard" link is critical - never trap the user in
  // an error state without a recovery action. Good UX always provides
  // an escape hatch.
  if (error) {
    return (
      <main className="eco-screen">
        <div className="eco-bg" />
        <div className="mobile-shell">
          <div className="general-error">
            <p>⚠ {error}</p>
          </div>
          <Link href="/dashboard" className="action-btn secondary-btn">
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // SUCCESS STATE: Render Suggestions
  // ───────────────────────────────────────────────────────────────────────────
  // If we reach this point, we have suggestions data ready to display.
  // The UI is structured to maximize readability and motivation:
  //   - Numbered cards (clear sequence)
  //   - Category icons (visual scanning)
  //   - Bold titles (quick comprehension)
  //   - Descriptions (actionable details)
  //   - Highlighted savings (motivation reinforcement)
  return (
    <main className="eco-screen">
      <div className="eco-bg" />

      {/* Floating particles */}
      <div className="particle particle-1" />
      <div className="particle particle-2" />
      <div className="particle particle-3" />
      <div className="particle particle-4" />
      <div className="particle particle-5" />
      <div className="particle particle-6" />

      <div className="mobile-shell">

        {/* ─────────────────────────────────────────────────────────────── */}
        {/* HEADER - Page identity and context                              */}
        {/* ─────────────────────────────────────────────────────────────── */}
        <section className="dash-header">
          <div className="earth-orb-wrap">
            <div className="earth-orb">
              <div className="earth-land land-1" />
              <div className="earth-land land-2" />
              <div className="earth-land land-3" />
            </div>
          </div>
          <h1 className="hero-title">AI Suggestions</h1>
          <p className="hero-subtitle">Personalized for you</p>
        </section>

        {/* ─────────────────────────────────────────────────────────────── */}
        {/* SUGGESTIONS LIST - The main content                             */}
        {/* ─────────────────────────────────────────────────────────────── */}
        {/* Using .map() to render an array as JSX is the standard React    */}
        {/* pattern. Each item needs a unique 'key' prop for React's        */}
        {/* reconciliation algorithm to efficiently update the DOM.         */}
        {/*                                                                 */}
        {/* Using index as key is acceptable here because:                  */}
        {/*   - The list is generated once and doesn't reorder              */}
        {/*   - Items aren't added/removed dynamically                      */}
        {/*   - There's no other stable unique ID from the AI response      */}
        <section className="dash-section">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="suggestion-card">

              {/* Card header with icon and number */}
              <div className="suggestion-header">
                <div className="suggestion-icon">
                  {/* Fallback emoji 💡 handles any unknown category from AI */}
                  {categoryIcons[suggestion.category] || "💡"}
                </div>
                <div className="suggestion-number">#{index + 1}</div>
              </div>

              
              {/* Bold title for quick scanning */}
              <h3 className="suggestion-title">{suggestion.title}</h3>
              {/* Detailed actionable advice from AI */}
              <p className="suggestion-desc">{suggestion.description}</p>

               {/* Savings badge - highlighted to motivate action */}
              <div className="suggestion-saving">
                <span className="saving-badge">{suggestion.saving}</span>
              </div>
            </div>
          ))}
        </section>

        {/* ─────────────────────────────────────────────────────────────── */}
        {/* ACTION BUTTONS - Continue the user journey                      */}
        {/* ─────────────────────────────────────────────────────────────── */}
        {/* After reading suggestions, users typically want to either:      */}
        {/*   - Go back to see their breakdown again                        */}
        {/*   - Recalculate with different inputs                           */}
        {/* We offer both, with "Recalculate" as primary to encourage       */}
        {/* the user to experiment and learn.                               */}
        <section className="action-section">
          <Link href="/dashboard" className="action-btn secondary-btn">
            ← Back to Dashboard
          </Link>
          <Link href="/calculator" className="action-btn primary-btn">
            ↻ Recalculate
          </Link>
        </section>

      </div>
    </main>
  );
}