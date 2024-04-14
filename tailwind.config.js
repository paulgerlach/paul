/** @type {import('tailwindcss').Config} */
export default {
  content: ['./*.html', './js/main.js'],
  theme: {
    screens: {
      "megalarge": {'max': "1200px"},
      "large": {'max': "992px"},
      "medium": {'max': "768px"},
      "small": {'max': "480px"},
    },
    extend: {
      colors: {
        dark_green: '#1E322D',
        green: '#8AD68F',
        card_bg: '#F3F3F3',
        section_bg: '#F7F7F6',
        card_dark_bg: '#EFEFEF',
        dark_text: '#1E322D',
        link: '#6083CC',
        card_light: '#E5EBF5',
        border_base: '#EFEDEB'
      },
      gap: {
        base: '10px'
      },
      borderRadius: {
        base: '10px',
        '1/2base': '5px'
      },
    },
  },
  plugins: [],
}

