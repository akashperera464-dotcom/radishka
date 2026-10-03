export default function CivilWorks({ onImageClick }) {
  const civilImg = "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200&auto=format&fit=crop";
  return (
    <section className="sec" id="civil" style={{ background: 'var(--bg2)', borderBlock: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="sec-head reveal">
          <div>
            <p className="overline">/// CIVIL WORKS · <span className="si" style={{ letterSpacing: 0 }}>සිවිල් ඉංජිනේරු ඉදිකිරීම්</span></p>
            <h2 className="sec-t" data-scramble data-txt="BUILDING SRI LANKA">BUILDING SRI LANKA</h2>
          </div>
          <span className="num">03</span>
        </div>
        <div className="civil-grid reveal">
          <div>
            <p style={{ color: 'var(--mut)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '20px' }}>
              Our construction division—Panther EC—executes residential, commercial, and agricultural infrastructure across the island, from structural foundation works to final architectural handover. Falcon ICM provides integrated project management, engineering supervision, and cost control under a single accountable contract.
            </p>
            <p style={{ color: 'var(--mut)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '30px' }}>
              Whether delivering multi-story commercial facilities, reinforced retaining structures, agricultural warehouses, or industrial drainage systems, we ensure rigorous structural compliance, transparent milestones, and superior engineering precision.
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
            <div
              className="feat-imgbox"
              onClick={() => onImageClick?.({
                src: civilImg,
                title: 'Civil Construction & Infrastructure',
                si: 'සිවිල් ඉදිකිරීම්',
                desc: 'Residential, Commercial and Agricultural civil works by Panther EC & Falcon ICM across Sri Lanka.'
              })}
              title="Click to view full image"
            >
              <img
                src={civilImg}
                alt="Civil construction site in Sri Lanka"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
