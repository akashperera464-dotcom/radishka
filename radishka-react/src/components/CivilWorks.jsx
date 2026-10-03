export default function CivilWorks() {
  return (
    <section className="sec" id="civil" style={{ background: 'var(--bg2)', borderBlock: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="sec-head reveal">
          <div>
            <p className="overline">/// CIVIL WORKS · <span className="si" style={{ letterSpacing: 0 }}>සිවිල් වැඩ</span></p>
            <h2 className="sec-t" data-scramble data-txt="BUILDING SRI LANKA">BUILDING SRI LANKA</h2>
          </div>
          <span className="num">03</span>
        </div>
        <div className="civil-grid reveal">
          <div>
            <p style={{ color: 'var(--mut)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '20px' }}>
              Our construction division — Panther EC — handles residential, commercial, and agricultural projects across the island, from foundations to finishing. Falcon ICM takes care of planning and management, so one team carries your project from survey to handover.
            </p>
            <p style={{ color: 'var(--mut)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '30px' }}>
              Whether it&apos;s a new building, a retaining wall, a drainage system, or a complete renovation — the same engineering precision and honest timelines that define our machine workshop.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { label: 'RESIDENTIAL', desc: 'Houses, annexes, and extensions built to last.' },
                { label: 'COMMERCIAL', desc: 'Shops, warehouses, and office spaces.' },
                { label: 'AGRICULTURAL', desc: 'Barns, storage sheds, and irrigation structures.' },
                { label: 'RENOVATION', desc: 'Repairs, upgrades, and structural strengthening.' },
              ].map(item => (
                <div key={item.label} style={{ border: '1px solid var(--line)', borderRadius: '6px', padding: '20px', background: 'var(--panel)' }}>
                  <b style={{ fontFamily: 'var(--fm)', fontSize: '.62rem', letterSpacing: '.22em', color: 'var(--ember2)', display: 'block', marginBottom: '8px' }}>{item.label}</b>
                  <p style={{ color: 'var(--mut)', fontSize: '.88rem', margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="feat-frame reveal" style={{ '--d': '140ms' }}>
            <div className="feat-imgbox">
              <img
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200&auto=format&fit=crop"
                alt="Civil construction site in Sri Lanka"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
