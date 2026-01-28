export const siteConfig = {
  company: {
    name: 'Paida All',
    slogan: 'Оптовые поставки',
    description: 'Оптовые поставки товаров в Караганде. Работаем с физическими и юридическими лицами.',
    logo: 'https://pic.maxiol.com/thumbs2/1753306101.86132844.paidaj.jpg',
    year: new Date().getFullYear(),
  },

  contacts: {
    phone: '+7 (778) 085-54-78',
    phoneRaw: '+77780855478',
    whatsapp: '77780855478',
    email: 'info@paidaall.kz',
    address: 'г. Караганда',
    city: 'Караганда',
    workingHours: 'Без выходных 9:00-21:00',
  },

  delivery: {
    freeDeliveryFrom: 50000,
    currency: '₸',
    deliveryTime: '1-2 рабочих дня',
    deliveryZone: 'Караганда и пригороды',
  },

  navigation: {
    main: [
      { name: 'Оплата', href: '/payment' },
      { name: 'Доставка', href: '/delivery' },
      { name: 'Контакты', href: '/contacts' },
      { name: 'О компании', href: '/about' },
    ],
  },

  catalog: {
    itemsPerPage: 48,
    defaultCategory: 'Все товары',
    noPhotoPlaceholder: '/placeholder.svg',
  },

  messages: {
    emptyCart: 'Ваша корзина пуста',
    addToCart: 'В корзину',
    checkout: 'Оформить в WhatsApp',
    noProducts: 'Товары не найдены',
    loading: 'Загрузка...',
  },
};

export const formatPrice = (price: number | null): string => {
  if (!price) return 'Цена не указана';
  return `${price.toLocaleString('ru-RU')} ${siteConfig.delivery.currency}`;
};

export const getWhatsAppLink = (message: string): string => {
  return `https://wa.me/${siteConfig.contacts.whatsapp}?text=${encodeURIComponent(message)}`;
};

export const getPhoneLink = (): string => {
  return `tel:${siteConfig.contacts.phoneRaw}`;
};
