export default function Band({ state }) {
  const s = state.site || {};
  const bandImg = state.images?.bandImg || '';
  return (
    <section className="band">
      <div
        className="band-bg"
        id="bandBg"
        data-prl="0.18"
        style={{ backgroundImage: `url('${bandImg}')` }}
      ></div>
      <div className="wrap band-in">
        <p className="lm"><span className="band-t">{s.bandEn1 || 'NO MACHINE FOR IT?'}</span></p>
        <p className="lm" style={{ '--d': '150ms' }}><span className="band-t ember">{s.bandEn2 || 'THEN WE BUILD ONE.'}</span></p>
        <p className="band-si si">{s.bandSi || 'නැති මැෂින් හදන එක තමයි අපේ වැඩේ.'}</p>
      </div>
    </section>
  );
}
