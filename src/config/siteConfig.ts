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
    email: 'paidaall.kz@gmail.com',
    address: 'г. Караганда',
    city: 'Караганда',
    instagram: '',
  },

  delivery: {
    currency: '₸',
    deliveryTime: '1-3 рабочих дня',
    description: 'Доставка по Казахстану осуществляется транспортными компаниями или InDriver',
    terms: [
      'Отправка транспортными компаниями',
      'Доставка через InDriver',
      'Самовывоз со склада в Караганде',
      'Срок доставки: 1-3 рабочих дня',
    ],
  },

  payment: {
    methods: [
      { name: 'Наличными', icon: 'banknote', description: 'Оплата наличными при получении товара курьеру или в пункте самовывоза.' },
      { name: 'Kaspi перевод', icon: 'smartphone', description: 'Перевод на Kaspi.' },
      { name: 'Безналичный расчёт', icon: 'building', description: 'Для юридических лиц. Оплата по счёту.' },
    ],
  },

  about: {
    title: 'О компании',
    intro: 'Paida All — надёжный партнёр в сфере оптовых поставок товаров. Мы работаем как с физическими, так и с юридическими лицами, предлагая широкий ассортимент продукции по конкурентным ценам.',
    features: [
      { title: 'Опыт работы', description: 'Многолетний опыт в сфере оптовой торговли позволяет нам предлагать лучшие условия для наших клиентов.' },
      { title: 'Клиенты', description: 'Работаем с розничными магазинами, ИП и т.д.' },
      { title: 'Качество', description: 'Гарантируем подлинность и качество всей продукции.' },
    ],
    advantages: [
      'Широкий ассортимент — более 2000 наименований',
      'Конкурентные оптовые цены',
      'Удобные способы оплаты',
      'Индивидуальный подход к каждому клиенту',
    ],
  },

  deliveryPage: {
    methods: [
      { title: 'Доставка по Казахстану', description: 'Отправка осуществляется транспортными компаниями или InDriver' },
      { title: 'Самовывоз', description: 'Бесплатный самовывоз со склада.' },
      { title: 'Сроки доставки', description: '1-3 рабочих дня. Точное время согласовывается с менеджером.' },
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

export const formatPrice = (price: number | null | undefined): string => {
  if (!price && price !== 0) return 'Цена не указана';
  return `${price.toLocaleString('ru-RU')} ${siteConfig.delivery.currency}`;
};

export const getWhatsAppLink = (message: string): string => {
  return `https://wa.me/${siteConfig.contacts.whatsapp}?text=${encodeURIComponent(message)}`;
};

export const getPhoneLink = (): string => {
  return `tel:${siteConfig.contacts.phoneRaw}`;
};
