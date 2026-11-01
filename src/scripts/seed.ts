import { connectDB, getEventsCollection } from '../config/db';
import { IEvent } from '../types';

const sampleEvents: Omit<IEvent, '_id'>[] = [
  {
    title: 'Winter Clothes Distribution – Mirpur 10, Dhaka',
    description:
      'Collecting and distributing warm jackets, sweaters, and shawls for low-income families and street dwellers in the Mirpur 10 circle area.',
    eventType: 'Donation',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
    location: 'Mirpur 10, Dhaka',
    eventDate: '2026-11-15',
    creatorEmail: 'organizer@careconnect.org',
    creatorName: 'Rahim Ahmed',
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Blanket Distribution for the Needy – Mohammadpur, Dhaka',
    description:
      'Night-time emergency blanket distribution for rough sleepers and rickshaw pullers braving the severe winter drop in Mohammadpur Town Hall area.',
    eventType: 'Donation',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
    location: 'Mohammadpur Town Hall, Dhaka',
    eventDate: '2026-11-20',
    creatorEmail: 'organizer@careconnect.org',
    creatorName: 'Fatima Zohra',
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Green City Tree Plantation Drive – Dhanmondi Lake',
    description:
      'Planting 1,000 indigenous fruit-bearing and shade trees along the Dhanmondi Lake walkway to combat urban heat island effects.',
    eventType: 'Plantation',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    location: 'Dhanmondi Lake Road 32, Dhaka',
    eventDate: '2026-11-25',
    creatorEmail: 'greenearth@careconnect.org',
    creatorName: 'Tanvir Hossain',
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Riverbank Plastic Cleanup & Waste Segregation',
    description:
      'Community volunteering cleanup campaign along the Buriganga riverbank to recover floating plastics and install waste bins.',
    eventType: 'Cleanup',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
    location: 'Sadarghat Riverbank, Dhaka',
    eventDate: '2026-12-05',
    creatorEmail: 'cleanriver@careconnect.org',
    creatorName: 'Kamal Uddin',
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Free Community Health Screening & First Aid Camp',
    description:
      'Providing free blood pressure, blood glucose, eye checkups, and necessary generic medicines for slum residents in Korail.',
    eventType: 'Healthcare',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
    location: 'Korail Slum, Mohakhali, Dhaka',
    eventDate: '2026-12-12',
    creatorEmail: 'healthforall@careconnect.org',
    creatorName: 'Dr. Nusrat Jahan',
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Free Educational Book & Stationery Drive for Street Children',
    description:
      'Distributing school bags, notebooks, pencils, and educational storybooks to children studying at open-air community schools.',
    eventType: 'Education',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    location: 'Shahbagh National Museum Square, Dhaka',
    eventDate: '2026-12-18',
    creatorEmail: 'shikkha@careconnect.org',
    creatorName: 'Shakil Chowdhury',
    createdAt: new Date().toISOString(),
  },
];

const seedData = async (): Promise<void> => {
  try {
    await connectDB();
    const eventsCollection = getEventsCollection();

    const count = await eventsCollection.countDocuments();
    if (count === 0) {
      console.log('Seeding initial community events data...');
      await eventsCollection.insertMany(sampleEvents as IEvent[]);
      console.log(`✅ Successfully seeded ${sampleEvents.length} events!`);
    } else {
      console.log(`Database already has ${count} events. Skipping seeding.`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();

