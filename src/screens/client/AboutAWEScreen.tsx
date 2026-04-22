export function AboutAWEScreen() {
  return (
    <div className="fade-in" style={{ background: 'var(--bark)', minHeight: '100vh' }}>
      <div className="inner-hero" style={{ background: 'var(--bark)' }}>
        <div className="inner-title" style={{ color: 'var(--cream)' }}>About <em>AWE</em></div>
      </div>
      <div className="awe-body" style={{ padding: 24, paddingBottom: 100 }}>
        <div className="awe-mark">AWE</div>
        <div className="awe-title">Awareness, Wonder &amp; Embodied Alignment</div>

        <div className="awe-pillars">
          {[
            { letter: 'A', name: 'Awareness', sub: 'Noticing what is' },
            { letter: 'W', name: 'Wonder', sub: 'Why · Open · Novelty · Discovery · Experimentation · Reflection' },
            { letter: 'E', name: 'Embodied\nAlignment', sub: 'Living your values' },
          ].map(p => (
            <div key={p.letter} className="awe-pillar">
              <span className="awe-pillar-letter">{p.letter}</span>
              <span className="awe-pillar-name" style={{ whiteSpace: 'pre-line' }}>{p.name}</span>
              <span className="awe-pillar-sub">{p.sub}</span>
            </div>
          ))}
        </div>

        <div className="awe-section">
          <span className="awe-section-label">The Philosophy</span>
          <div className="awe-text">
            <p>AWE is a wellbeing paradigm built on the belief that <strong>awareness is the foundation of all change</strong>. Before we can shift patterns, we must first notice them — with curiosity rather than judgement.</p>
            <br />
            <p><strong>Wonder</strong> is the practice of approaching life with openness. It stands for <em>Why, Open, Novelty, Discovery, Experimentation &amp; Reflection</em> — a set of orientations that keep us learning and growing.</p>
            <br />
            <p><strong>Embodied Alignment</strong> means living in a way that is consistent with your deepest values — not just thinking about them, but feeling them in your body and expressing them in your actions.</p>
          </div>
        </div>

        <div className="awe-section">
          <span className="awe-section-label">Your Expedition</span>
          <div className="awe-text">
            <p>This app is your companion between coaching sessions. Use it to reflect on your journey, track your experiments, and capture the moments of awareness that arise in daily life.</p>
            <br />
            <p>There are no wrong answers here — only awareness. Every reflection, however small, is a step forward on your AWExpedition.</p>
          </div>
        </div>

        <div className="awe-closing">
          "I'm AWEsome" means I have awareness, wonder &amp; embodied alignment — on any kind of day.
        </div>
      </div>
    </div>
  );
}
