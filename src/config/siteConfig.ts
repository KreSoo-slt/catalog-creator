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
    workingHours: 'Пн-ПТ 11:00-21:00',
    instagram: '', // Добавьте ссылку на Instagram если есть
  },

  delivery: {
    freeDeliveryFrom: 50000,
    currency: '₸',
    deliveryTime: '1-2 рабочих дня',
    deliveryZone: 'Караганда и пригороды',
    // Условия доставки для страницы "Доставка"
    terms: [
      'Бесплатная доставка при заказе от 50 000 ₸',
      'Доставка по Караганде и пригородам',
      'Срок доставки: 1-2 рабочих дня',
      'Доставка осуществляется ежедневно с 9:00 до 21:00',
      'Самовывоз доступен по адресу склада',
    ],
  },

  payment: {
    // Способы оплаты для страницы "Оплата"
    methods: [
     
      { name: 'Kaspi ', description: 'Перевод на Kaspi ' },
      
      { name: 'Безналичный расчёт', description: 'Для юридических лиц.' },
    ],
  },

  about: {
    title: 'О компании Paida All',
    description: 'Оптовые поставки товаров по Казахстану. Работаем с физическими и юридическими лицами.',
    content: [
      'Компания Paida All — надёжный оптовый поставщик товаров в Казахстане.',
      'Мы работаем как с физическими, так и с юридическими лицами.',
      'Наш ассортимент включает более 1000 наименований товаров.',
      'Гарантируем качество продукции.',
    ],
    features: [
      { title: 'Широкий ассортимент', description: 'Более 1000 товаров в каталоге' },
      { title: 'Оптовые цены', description: 'Выгодные цены для всех клиентов' },
 
     
    ],
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
