// Mock location data and service functions

// Define types for location data
export interface Location {
  id: number;
  name: string;
  region: string;
}

// Sample locations data
const mockLocations: Location[] = [
  { id: 1, name: 'Addis Ababa', region: 'Addis Ababa' },
  { id: 2, name: 'Bahir Dar', region: 'Amhara' },
  { id: 3, name: 'Hawassa', region: 'Sidama' },
  { id: 4, name: 'Dire Dawa', region: 'Dire Dawa' },
  { id: 5, name: 'Mekelle', region: 'Tigray' },
  { id: 6, name: 'Gondar', region: 'Amhara' },
  { id: 7, name: 'Adama', region: 'Oromia' },
  { id: 8, name: 'Jimma', region: 'Oromia' },
  { id: 9, name: 'Dessie', region: 'Amhara' },
  { id: 10, name: 'Sodo', region: 'SNNPR' },
  { id: 11, name: 'Arba Minch', region: 'SNNPR' },
  { id: 12, name: 'Hosaena', region: 'SNNPR' },
  { id: 13, name: 'Debre Birhan', region: 'Amhara' },
  { id: 14, name: 'Debre Markos', region: 'Amhara' },
  { id: 15, name: 'Nekemte', region: 'Oromia' },
];

export const fetchLocations = async (): Promise<Location[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return mockLocations;
};

export const searchLocations = async (query: string): Promise<Location[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Filter locations based on query
  const filteredLocations = mockLocations.filter(location => 
    location.name.toLowerCase().includes(query.toLowerCase()) ||
    location.region.toLowerCase().includes(query.toLowerCase())
  );
  
  return filteredLocations;
};