// Mock data for various components

// Popular destinations for the home screen
export const popularDestinations = [
  {
    id: 'dest1',
    name: 'Bahir Dar',
    imageUrl: 'https://images.pexels.com/photos/2945261/pexels-photo-2945261.jpeg',
    price: 500,
  },
  {
    id: 'dest2',
    name: 'Hawassa',
    imageUrl: 'https://images.pexels.com/photos/4275885/pexels-photo-4275885.jpeg',
    price: 350,
  },
  {
    id: 'dest3',
    name: 'Gondar',
    imageUrl: 'https://images.pexels.com/photos/3889843/pexels-photo-3889843.jpeg',
    price: 650,
  },
  {
    id: 'dest4',
    name: 'Dire Dawa',
    imageUrl: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
    price: 800,
  },
];

// Featured trips for the home screen
export const featuredTrips = [
  {
    id: 'trip1',
    from: 'Addis Ababa',
    to: 'Bahir Dar',
    date: '2025-06-01',
    departureTime: '09:00',
    departureTerminal: 'Meskel Square Terminal',
    price: 500,
    availableSeats: 28,
    company: {
      name: 'Selam Bus',
      logoUrl: 'https://images.pexels.com/photos/2148222/pexels-photo-2148222.jpeg',
      rating: 4.7,
    },
  },
  {
    id: 'trip2',
    from: 'Addis Ababa',
    to: 'Hawassa',
    date: '2025-06-02',
    departureTime: '08:30',
    departureTerminal: 'Mexico Square Terminal',
    price: 350,
    availableSeats: 15,
    company: {
      name: 'Sky Bus',
      logoUrl: 'https://images.pexels.com/photos/3760847/pexels-photo-3760847.jpeg',
      rating: 4.5,
    },
  },
  {
    id: 'trip3',
    from: 'Addis Ababa',
    to: 'Gondar',
    date: '2025-06-03',
    departureTime: '20:00',
    departureTerminal: 'Meskel Square Terminal',
    price: 650,
    availableSeats: 8,
    company: {
      name: 'Golden Bus',
      logoUrl: 'https://images.pexels.com/photos/2833855/pexels-photo-2833855.jpeg',
      rating: 4.8,
    },
  },
];

// Community posts for the community screen
export const communityPosts = [
  {
    id: 'post1',
    user: {
      id: 'user1',
      name: 'Abebe Kebede',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    },
    content: 'Just had an amazing trip to Bahir Dar with Selam Bus! The lake views were incredible and the bus was very comfortable.',
    images: [
      'https://images.pexels.com/photos/2945261/pexels-photo-2945261.jpeg',
      'https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg',
    ],
    timestamp: '2025-05-28T08:45:00Z',
    likes: 24,
    comments: 6,
    liked: false,
  },
  {
    id: 'post2',
    user: {
      id: 'user2',
      name: 'Sara Mohammed',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    },
    content: 'Looking for recommendations for the best bus company to travel from Addis to Hawassa next weekend. Any suggestions?',
    images: [],
    timestamp: '2025-05-27T15:32:00Z',
    likes: 8,
    comments: 12,
    liked: false,
  },
  {
    id: 'post3',
    user: {
      id: 'user3',
      name: 'Daniel Tesfaye',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    },
    content: 'Trip to Gondar was fantastic! Here are some photos from my journey. The historical sites are a must-visit for anyone traveling to Ethiopia.',
    images: [
      'https://images.pexels.com/photos/3889843/pexels-photo-3889843.jpeg',
      'https://images.pexels.com/photos/9480405/pexels-photo-9480405.jpeg',
      'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg',
    ],
    timestamp: '2025-05-26T10:15:00Z',
    likes: 42,
    comments: 9,
    liked: true,
  },
];