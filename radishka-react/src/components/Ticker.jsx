export default function Ticker({ state }) {
  const items = (state.ticker || []).filter(Boolean);
  const services = (state.services || []).map(s => s.t?.toUpperCase());
  const doubled = arr => [...arr, ...arr];

  return (
    <div className="ticker" aria-hidden="true">
      <div className="tick-row" id="tick1">
        {doubled(items).map((x, i) => <span key={i}>{x}</span>)}
      </div>
      <div className="tick-row rev" id="tick2">
        {doubled(services).map((x, i) => <span key={i}>{x}</span>)}
      </div>
    </div>
  );
}
