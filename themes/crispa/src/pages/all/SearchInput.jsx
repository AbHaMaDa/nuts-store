import { _ } from '@evershop/evershop/lib/locale/translate/_';
import React, { useEffect, useRef, useState } from 'react';

export default function SearchInput() {
  const [keyword, setKeyword] = useState('');
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    wrapRef.current?.querySelector('input')?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = keyword.trim();
    setOpen(false);
    if (trimmed) {
      window.location.href = `/search?keyword=${encodeURIComponent(trimmed)}`;
    }
  };

  return (
    <div
      ref={wrapRef}
      className={`crispa-search-wrap${open ? ' is-open' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <button
        type="button"
        className="crispa-search-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-label={_('Search')}
        aria-expanded={open}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
      <form className="crispa-inline-search" onSubmit={handleSubmit} role="search">
        <button type="submit" aria-label={_('Search')}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
        <input
          type="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={_('Search for a product...')}
          autoFocus={open}
        />
        <button
          type="button"
          className="crispa-search-close"
          onClick={() => setOpen(false)}
          aria-label={_('Close search')}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </form>
    </div>
  );
}

export const layout = {
  areaId: 'headerMiddleRight',
  sortOrder: 5
};
