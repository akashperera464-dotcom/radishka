export default function ContactMap({ lat, lng, address }) {
  const latitude = lat || 6.705659429768915;
  const longitude = lng || 80.55773376535957;

  // Dark-styled responsive Google Map embed via open standard coordinates URL
  const mapEmbedUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&hl=en&z=15&output=embed`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  return (
    <div className="map-sec reveal">
      <div className="map-header">
        <b>📍 WORKSHOP LOCATION · {address || 'Wewalwatta, Ratnapura'}</b>
        <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
          OPEN IN GOOGLE MAPS ↗
        </a>
      </div>
      <iframe
        title="KRS KING Workshop Location Map"
        className="map-frame"
        src={mapEmbedUrl}
        loading="lazy"
        allowFullScreen
      ></iframe>
    </div>
  );
}
