export interface RadioStation {
  id: string;
  name: string;
  frequency: string;
  location: string;
  streamUrl: string;
  logoUrl: string;
  description: string;
  category: 'News' | 'Music' | 'Talk' | 'General';
}
