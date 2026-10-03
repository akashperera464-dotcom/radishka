const FALLBACK_BAND_IMG = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1600&auto=format&fit=crop';

export default function Band({ state }) {
  const s = state.site || {};
  const bandImg = (state.images?.bandImg && state.images.bandImg.trim()) ? state.images.bandImg : FALLBACK_BAND_IMG;

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
        <p className="band-si si">{s.bandSi || 'ඔබගේ විශේෂිත අවශ්‍යතාවයට සරිලන නවීන තාක්ෂණික යන්ත්‍රෝපකරණ අප නිපදවන්නෙමු.'}</p>
      </div>
    </section>
  );
}
