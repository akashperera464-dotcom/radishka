import { useEffect, useRef } from 'react';

export default function Toast({ message, visible }) {
  return (
    <div id="toast" role="status" className={visible ? 'show' : ''}>
      {message}
    </div>
  );
}
