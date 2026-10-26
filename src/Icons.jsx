import React from 'react';

// Simple SVG icons — hand-written, consistent 16px style
export const Icons = {
  Dashboard: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1.5" y="1.5" width="5" height="5" rx="1.2"/>
      <rect x="9.5" y="1.5" width="5" height="5" rx="1.2"/>
      <rect x="1.5" y="9.5" width="5" height="5" rx="1.2"/>
      <rect x="9.5" y="9.5" width="5" height="5" rx="1.2"/>
    </svg>
  ),
  Students: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="5" r="2.8"/>
      <path d="M2 14c0-2.8 2.7-5 6-5s6 2.2 6 5"/>
    </svg>
  ),
  Classes: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1.5" y="2.5" width="13" height="11" rx="1.5"/>
      <path d="M5 2.5V1M11 2.5V1M1.5 6.5h13"/>
    </svg>
  ),
  Attendance: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M13 6A5 5 0 1 1 6 1"/>
      <path d="M10 1l3 3-5 5-2-2"/>
    </svg>
  ),
  Announcements: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 5.5h8l3-3v10l-3-3H2V5.5z"/>
    </svg>
  ),
  Results: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 12V8M7 12V5M11 12V2" strokeLinecap="round"/>
    </svg>
  ),
  TechStack: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1.5" y="1.5" width="13" height="4" rx="1"/>
      <rect x="1.5" y="10.5" width="13" height="4" rx="1"/>
      <path d="M4 3.5h1M4 12.5h1M7 3.5h5M7 12.5h5"/>
      <path d="M1.5 6h13M1.5 10h13" strokeDasharray="2 2"/>
    </svg>
  ),
  Plus: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M8 3v10M3 8h10" strokeLinecap="round"/>
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="6.5" cy="6.5" r="4"/>
      <path d="M10 10l3 3" strokeLinecap="round"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Bell: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 2a4 4 0 0 1 4 4v2.5l1 1.5H3l1-1.5V6a4 4 0 0 1 4-4z"/>
      <path d="M6.5 13a1.5 1.5 0 0 0 3 0"/>
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round"/>
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 8l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ArrowUp: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M8 13V3M4 7l4-4 4 4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Export: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10 2h3.5V5.5M13.5 2L9 6.5M8 3H3.5A1.5 1.5 0 0 0 2 4.5v7A1.5 1.5 0 0 0 3.5 13h9a1.5 1.5 0 0 0 1.5-1.5V8"/>
    </svg>
  ),
  Lock: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="6.5" width="10" height="7.5" rx="1.5"/>
      <path d="M5.5 6.5V4.5a2.5 2.5 0 0 1 5 0v2"/>
      <circle cx="8" cy="10" r="1" fill="currentColor"/>
    </svg>
  ),
  LogOut: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 14H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h3"/>
      <path d="M10.5 11l3-3-3-3M13.5 8H6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Eye: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M1.5 8s2.5-4.5 6.5-4.5S14.5 8 14.5 8s-2.5 4.5-6.5 4.5S1.5 8 1.5 8z"/>
      <circle cx="8" cy="8" r="2"/>
    </svg>
  ),
  EyeOff: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 2l12 12M6.6 6.6a2 2 0 0 0 2.8 2.8"/>
      <path d="M9.8 4.6A6.6 6.6 0 0 0 8 3.5C4 3.5 1.5 8 1.5 8a11.2 11.2 0 0 0 3.6 3.6m3.3.9c4 0 6.1-4.5 6.1-4.5a11.5 11.5 0 0 0-2.2-2.8"/>
    </svg>
  ),
  Shield: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 2l5.5 2v4c0 3.5-2.5 5.5-5.5 6.5C4.5 13.5 2 11.5 2 8V4L8 2z"/>
      <path d="M6 8l1.5 1.5L10.5 6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};
