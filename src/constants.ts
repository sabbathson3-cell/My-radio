import { RadioStation } from './types';

export const STATIONS: RadioStation[] = [
  {
    id: 'kantipur',
    name: 'Radio Kantipur',
    frequency: '96.1 MHz',
    location: 'Kathmandu',
    streamUrl: 'https://radio-broadcast.ekantipur.com/stream',
    logoUrl: 'https://picsum.photos/seed/kantipur/200/200',
    description: 'The most popular radio station in Nepal, offering news, music, and talk shows.',
    category: 'General'
  },
  {
    id: 'bbc-nepali',
    name: 'BBC Nepali',
    frequency: 'Online',
    location: 'London/Kathmandu',
    streamUrl: 'https://stream.live.vc.bbcmedia.co.uk/bbc_nepali_radio',
    logoUrl: 'https://picsum.photos/seed/bbc/200/200',
    description: 'International news and current affairs in Nepali language.',
    category: 'News'
  },
  {
    id: 'image-fm',
    name: 'Image FM',
    frequency: '97.9 MHz',
    location: 'Kathmandu',
    streamUrl: 'https://image-stream.softnep.com:8000/live',
    logoUrl: 'https://picsum.photos/seed/imagefm/200/200',
    description: 'Known for its high-quality music programming and youth-centric shows.',
    category: 'Music'
  },
  {
    id: 'ujyaalo',
    name: 'Ujyaalo 90 Network',
    frequency: '90.0 MHz',
    location: 'Kathmandu',
    streamUrl: 'https://stream.zeno.fm/86296y75v98uv',
    logoUrl: 'https://picsum.photos/seed/ujyaalo/200/200',
    description: 'A leading news-focused radio network with extensive coverage across Nepal.',
    category: 'News'
  },
  {
    id: 'hits-fm',
    name: 'Hits FM',
    frequency: '91.2 MHz',
    location: 'Kathmandu',
    streamUrl: 'https://hits-stream.softnep.com:8000/live',
    logoUrl: 'https://picsum.photos/seed/hitsfm/200/200',
    description: 'One of the first private FM stations in Nepal, famous for its countdown shows.',
    category: 'Music'
  },
  {
    id: 'radio-nepal',
    name: 'Radio Nepal',
    frequency: 'AM/FM',
    location: 'Singha Durbar, Kathmandu',
    streamUrl: 'https://radionepal.gov.np:8000/live',
    logoUrl: 'https://picsum.photos/seed/radionepal/200/200',
    description: 'The national broadcasting service of Nepal, established in 1951.',
    category: 'General'
  }
];
