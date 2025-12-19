// Demo data for widget development

export const demoData = {
  weather: {
    location: 'Demo City',
    temperature: 25,
    humidity: 60,
    windSpeed: 12,
    feelsLike: 27,
    uvIndex: 5,
    weatherCode: 0
  },
  products: [{
    id: 1,
    name: 'Demo Product',
    short_description: 'This is a demo product for development.',
    permalink: '#',
    prices: {
      price: '1999',
      regular_price: '2499',
      sale_price: '1999',
      currency_symbol: '$',
      currency_minor_unit: 2
    },
    on_sale: true,
    average_rating: '4.5',
    review_count: 12,
    images: [{ src: 'https://via.placeholder.com/300', alt: 'Demo' }],
    categories: [{ name: 'Demo Category' }],
    is_in_stock: true
  }]
}
