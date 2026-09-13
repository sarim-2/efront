import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';

export function SearchBar({ className = '', placeholder = 'Search products...' }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [term, setTerm] = useState(searchParams.get('q') || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (term.trim()) {
      navigate(`/shop?q=${encodeURIComponent(term.trim())}`);
    } else {
      navigate('/shop');
    }
  };

  const handleClear = () => {
    setTerm('');
    navigate('/shop');
  };

  return (
    <form onSubmit={handleSubmit} className={`relative flex items-center ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2 border border-border rounded-md text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
      />
      {term && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </form>
  );
}
