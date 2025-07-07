/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
    "./public/index.html"
  ],
  safelist: [
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
    "text-white",
    "text-black",
    "p-4",
    "rounded-lg"
  ],
  theme: {
  screens: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
},
  theme: {
    extend: {},
  },
  plugins: [],
}
safelist: [
  'bg-green-500',
  'bg-yellow-500',
  'bg-red-500',
  'bg-gray-400'
]