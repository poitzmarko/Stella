/** @type {import('tailwindcss').Config} */
module.exports = { darkMode: ['class'], content: ['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}','./lib/**/*.{ts,tsx}'], theme: { extend: { boxShadow: { soft: '0 20px 60px rgba(2,6,23,0.12)' }, borderRadius: { '2xl': '1.25rem', '3xl': '1.75rem' } } }, plugins: [] };
