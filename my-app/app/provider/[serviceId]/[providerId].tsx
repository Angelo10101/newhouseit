import { useLocalSearchParams, router, Stack } from 'expo-router';
import { StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

// Mock provider data - in a real app, this would come from an API
const providerDetails = {
  electrician: {
    1: {
      name: 'Lightning Electric Co.',
      rating: 4.8,
      reviews: 142,
      distance: '2.3 km',
      phone: '+27 11 123 4567',
      email: 'info@lightningelectric.co.za',
      address: '123 Spark Street, Johannesburg, 2001',
      website: 'www.lightningelectric.co.za',
      hours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-2PM',
      description: 'Professional electrical services with over 20 years of experience. We specialize in residential and commercial electrical installations, repairs, and maintenance.',
      services: ['Outlet Installation', 'Light Fixture Installation', 'Circuit Breaker Repair', 'Electrical Panel Upgrade', 'Wiring Inspection'],
    },
    2: {
      name: 'PowerUp Services',
      rating: 4.6,
      reviews: 89,
      distance: '3.7 km',
      phone: '+27 11 234 5678',
      email: 'contact@powerupservices.co.za',
      address: '456 Voltage Avenue, Sandton, 2196',
      website: 'www.powerupservices.co.za',
      hours: 'Mon-Sat: 7AM-7PM',
      description: 'Quality electrical work at affordable prices. Fast response time and professional service guaranteed.',
      services: ['Home Rewiring', 'Emergency Repairs', 'Solar Installation', 'Lighting Design', 'Safety Inspections'],
    },
    3: {
      name: 'Bright Spark Electric',
      rating: 4.9,
      reviews: 203,
      distance: '1.5 km',
      phone: '+27 11 345 6789',
      email: 'hello@brightspark.co.za',
      address: '789 Electric Road, Rosebank, 2196',
      website: 'www.brightspark.co.za',
      hours: 'Mon-Fri: 7AM-8PM, Sat-Sun: 8AM-5PM',
      description: 'Award-winning electrical contractors serving Johannesburg and surrounding areas. We pride ourselves on excellent customer service.',
      services: ['Complete Rewiring', 'Smart Home Installation', 'Emergency Service', 'Commercial Projects', 'Energy Efficiency Upgrades'],
    }
  },
  plumbing: {
    1: {
      name: 'AquaFix Pro',
      rating: 4.7,
      reviews: 156,
      distance: '2.8 km',
      phone: '+27 11 456 7890',
      email: 'service@aquafixpro.co.za',
      address: '321 Water Lane, Bryanston, 2021',
      website: 'www.aquafixpro.co.za',
      hours: 'Mon-Fri: 7AM-7PM, Emergency 24/7',
      description: 'Expert plumbing services for all your needs. From leak repairs to complete bathroom installations.',
      services: ['Leak Repair', 'Drain Cleaning', 'Toilet Installation', 'Water Heater Repair', 'Pipe Replacement'],
    },
    2: {
      name: 'Pipeline Masters',
      rating: 4.5,
      reviews: 94,
      distance: '4.2 km',
      phone: '+27 11 567 8901',
      email: 'info@pipelinemasters.co.za',
      address: '654 Flow Street, Randburg, 2194',
      website: 'www.pipelinemasters.co.za',
      hours: 'Mon-Sat: 8AM-6PM',
      description: 'Reliable plumbing solutions with competitive pricing. No job too big or small.',
      services: ['Burst Pipes', 'Geyser Installation', 'Bathroom Renovation', 'Gas Fitting', 'Drain Unblocking'],
    },
    3: {
      name: 'Flow Control Services',
      rating: 4.8,
      reviews: 178,
      distance: '1.9 km',
      phone: '+27 11 678 9012',
      email: 'support@flowcontrol.co.za',
      address: '987 Plumber Avenue, Hyde Park, 2196',
      website: 'www.flowcontrol.co.za',
      hours: 'Mon-Sun: 6AM-10PM',
      description: 'Your trusted plumbing partner. We offer comprehensive plumbing services with a focus on quality and customer satisfaction.',
      services: ['Emergency Plumbing', 'Water Filtration', 'Sewer Line Repair', 'Kitchen Plumbing', 'Outdoor Plumbing'],
    }
  },
  roofing: {
    1: {
      name: 'TopShield Roofing',
      rating: 4.9,
      reviews: 234,
      distance: '3.4 km',
      phone: '+27 11 789 0123',
      email: 'quotes@topshield.co.za',
      address: '135 Roof Road, Fourways, 2055',
      website: 'www.topshield.co.za',
      hours: 'Mon-Fri: 7AM-6PM',
      description: 'Premium roofing services. From repairs to complete roof replacements, we do it all.',
      services: ['Roof Repairs', 'Roof Replacement', 'Waterproofing', 'Gutter Installation', 'Roof Inspection'],
    },
    2: {
      name: 'SkyGuard Services',
      rating: 4.6,
      reviews: 112,
      distance: '4.8 km',
      phone: '+27 11 890 1235',
      email: 'info@skyguard.co.za',
      address: '246 Sky Drive, Midrand, 1685',
      website: 'www.skyguard.co.za',
      hours: 'Mon-Sat: 7AM-5PM',
      description: 'Experienced roofing contractors with a focus on quality and durability. Satisfaction guaranteed.',
      services: ['Tile Roofing', 'Metal Roofing', 'Leak Detection', 'Roof Maintenance', 'Storm Damage Repair'],
    },
    3: {
      name: 'Apex Roofing Co.',
      rating: 4.7,
      reviews: 189,
      distance: '3.9 km',
      phone: '+27 11 901 2346',
      email: 'service@apexroofing.co.za',
      address: '357 Peak Street, Centurion, 0157',
      website: 'www.apexroofing.co.za',
      hours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-3PM',
      description: 'Top-quality roofing solutions for residential and commercial properties. Licensed and insured.',
      services: ['Flat Roofing', 'Pitched Roofing', 'Roof Coating', 'Skylight Installation', 'Fascia & Soffit'],
    }
  },
  painting: {
    1: {
      name: 'ColorCraft Painters',
      rating: 4.8,
      reviews: 167,
      distance: '2.1 km',
      phone: '+27 11 890 1234',
      email: 'info@colorcraft.co.za',
      address: '246 Paint Street, Melville, 2092',
      website: 'www.colorcraft.co.za',
      hours: 'Mon-Sat: 8AM-6PM',
      description: 'Professional painting services for residential and commercial properties. Quality finish guaranteed.',
      services: ['Interior Painting', 'Exterior Painting', 'Wall Preparation', 'Color Consultation', 'Texture Coating'],
    },
    2: {
      name: 'Brush & Roll Pro',
      rating: 4.5,
      reviews: 98,
      distance: '3.6 km',
      phone: '+27 11 902 3457',
      email: 'contact@brushroll.co.za',
      address: '468 Palette Road, Benoni, 1500',
      website: 'www.brushroll.co.za',
      hours: 'Mon-Fri: 7AM-6PM',
      description: 'Affordable painting services without compromising on quality. Free quotes and color matching.',
      services: ['House Painting', 'Office Painting', 'Decorative Finishes', 'Wallpaper Removal', 'Pressure Washing'],
    },
    3: {
      name: 'Perfect Finish Paint',
      rating: 4.9,
      reviews: 223,
      distance: '1.7 km',
      phone: '+27 11 013 4568',
      email: 'info@perfectfinish.co.za',
      address: '579 Color Avenue, Boksburg, 1459',
      website: 'www.perfectfinish.co.za',
      hours: 'Mon-Sat: 8AM-7PM',
      description: 'Award-winning painters with attention to detail. We transform your space with precision and care.',
      services: ['Premium Painting', 'Waterproofing Paint', 'Wood Staining', 'Damp Proofing', 'Specialty Coatings'],
    }
  },
  mechanic: {
    1: {
      name: 'Mobile Auto Care',
      rating: 4.7,
      reviews: 134,
      distance: '1.8 km',
      phone: '+27 11 901 2345',
      email: 'service@mobileautocare.co.za',
      address: '357 Motor Way, Parktown, 2193',
      website: 'www.mobileautocare.co.za',
      hours: 'Mon-Sat: 7AM-7PM',
      description: 'Mobile mechanic service that comes to you. Professional vehicle repairs and maintenance at your doorstep.',
      services: ['Engine Diagnostics', 'Brake Service', 'Oil Change', 'Tire Replacement', 'Battery Replacement'],
    },
    2: {
      name: 'DriveRight Services',
      rating: 4.6,
      reviews: 87,
      distance: '3.2 km',
      phone: '+27 11 024 5679',
      email: 'info@driveright.co.za',
      address: '680 Auto Street, Kempton Park, 1619',
      website: 'www.driveright.co.za',
      hours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-2PM',
      description: 'Comprehensive auto repair and maintenance services. All makes and models welcome.',
      services: ['Full Service', 'Transmission Repair', 'Air Conditioning', 'Electrical Diagnostics', 'Suspension Repair'],
    },
    3: {
      name: 'OnSite Auto Repair',
      rating: 4.8,
      reviews: 156,
      distance: '2.4 km',
      phone: '+27 11 135 6780',
      email: 'bookings@onsiteauto.co.za',
      address: '791 Garage Lane, Edenvale, 1609',
      website: 'www.onsiteauto.co.za',
      hours: 'Mon-Sun: 7AM-8PM',
      description: 'On-site vehicle repairs and servicing. We come to your home or office for convenient car care.',
      services: ['Mobile Servicing', 'Pre-purchase Inspection', 'Roadworthy Certificates', 'Fleet Maintenance', 'Emergency Repairs'],
    }
  },
  entertainment: {
    1: {
      name: 'TechSetup Pro',
      rating: 4.9,
      reviews: 198,
      distance: '2.5 km',
      phone: '+27 11 012 3456',
      email: 'bookings@techsetuppro.co.za',
      address: '468 Tech Avenue, Morningside, 2196',
      website: 'www.techsetuppro.co.za',
      hours: 'Mon-Sun: 9AM-8PM',
      description: 'Expert home entertainment installation and setup. Transform your home into a smart entertainment hub.',
      services: ['TV Mounting', 'Home Theater Setup', 'Sound System Installation', 'Smart Home Integration', 'Cable Management'],
    },
    2: {
      name: 'MediaInstall Experts',
      rating: 4.7,
      reviews: 143,
      distance: '3.8 km',
      phone: '+27 11 246 7891',
      email: 'service@mediainstall.co.za',
      address: '902 Media Road, Sandton, 2196',
      website: 'www.mediainstall.co.za',
      hours: 'Mon-Sat: 9AM-7PM',
      description: 'Professional audio-visual installation services. We specialize in creating immersive entertainment experiences.',
      services: ['Surround Sound', 'Projector Installation', 'Gaming Setup', 'Streaming Device Setup', 'WiFi Optimization'],
    },
    3: {
      name: 'HomeTheater Plus',
      rating: 4.8,
      reviews: 176,
      distance: '2.9 km',
      phone: '+27 11 357 8902',
      email: 'info@hometheaterplus.co.za',
      address: '1013 Cinema Street, Rosebank, 2196',
      website: 'www.hometheaterplus.co.za',
      hours: 'Mon-Fri: 10AM-8PM, Sat-Sun: 10AM-6PM',
      description: 'Complete home theater solutions from design to installation. Experience cinema-quality at home.',
      services: ['Custom Home Theaters', 'Acoustic Treatment', 'Lighting Control', 'Multi-room Audio', 'Automation Systems'],
    }
  },
  interior: {
    1: {
      name: 'Design & Style Co.',
      rating: 4.9,
      reviews: 267,
      distance: '3.8 km',
      phone: '+27 11 123 4567',
      email: 'design@designstyle.co.za',
      address: '579 Design Street, Parkview, 2193',
      website: 'www.designstyle.co.za',
      hours: 'Mon-Fri: 9AM-6PM, Sat: 10AM-3PM',
      description: 'Transform your space with our expert interior design services. We bring your vision to life.',
      services: ['Space Planning', 'Color Schemes', 'Furniture Selection', 'Lighting Design', 'Complete Renovation'],
    },
    2: {
      name: 'Modern Spaces',
      rating: 4.6,
      reviews: 134,
      distance: '4.5 km',
      phone: '+27 11 468 9013',
      email: 'hello@modernspaces.co.za',
      address: '1124 Style Avenue, Hyde Park, 2196',
      website: 'www.modernspaces.co.za',
      hours: 'Mon-Fri: 9AM-5PM',
      description: 'Contemporary interior design for modern living. We create functional and beautiful spaces.',
      services: ['Modern Design', 'Kitchen Redesign', 'Bathroom Styling', 'Office Interiors', '3D Visualization'],
    },
    3: {
      name: 'Elite Interiors',
      rating: 4.8,
      reviews: 201,
      distance: '3.1 km',
      phone: '+27 11 579 0124',
      email: 'contact@eliteinteriors.co.za',
      address: '1235 Luxury Lane, Sandton, 2196',
      website: 'www.eliteinteriors.co.za',
      hours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-2PM',
      description: 'Luxury interior design services for discerning clients. Elegant solutions tailored to your lifestyle.',
      services: ['Luxury Design', 'Custom Furniture', 'Art Curation', 'Window Treatments', 'Project Management'],
    }
  }
};

export default function ProviderDetailScreen() {
  const { serviceId, providerId } = useLocalSearchParams();

  const serviceKey = Array.isArray(serviceId) ? serviceId[0] : serviceId;
  const providerKey = Array.isArray(providerId) ? providerId[0] : providerId;

  const serviceProviders = providerDetails[serviceKey as keyof typeof providerDetails];
  const provider = serviceProviders ? (serviceProviders as any)[parseInt(providerKey)] : null;

  if (!provider) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Provider not found</ThemedText>
      </ThemedView>
    );
  }

  const handleCall = () => {
    Linking.openURL(`tel:${provider.phone}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${provider.email}`);
  };

  const handleWebsite = () => {
    Linking.openURL(`https://${provider.website}`);
  };

  const handleDirections = () => {
    const address = encodeURIComponent(provider.address);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${address}`);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ThemedText style={styles.backText}>‹ Back</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Business Name and Rating */}
          <ThemedView style={styles.businessHeader}>
            <ThemedText type="title" style={styles.businessName}>
              {provider.name}
            </ThemedText>
            <ThemedView style={styles.ratingContainer}>
              <IconSymbol name="star.fill" size={20} color="#FFB800" />
              <ThemedText style={styles.rating}>{provider.rating}</ThemedText>
              <ThemedText style={styles.reviews}>({provider.reviews} reviews)</ThemedText>
            </ThemedView>
            <ThemedView style={styles.distanceContainer}>
              <IconSymbol name="location.fill" size={16} color="#666666" />
              <ThemedText style={styles.distance}>{provider.distance} away</ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Quick Actions */}
          <ThemedView style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
              <IconSymbol name="phone.fill" size={24} color="#000000" />
              <ThemedText style={styles.actionText}>Call</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleDirections}>
              <IconSymbol name="map.fill" size={24} color="#000000" />
              <ThemedText style={styles.actionText}>Directions</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleWebsite}>
              <IconSymbol name="globe" size={24} color="#000000" />
              <ThemedText style={styles.actionText}>Website</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleEmail}>
              <IconSymbol name="envelope.fill" size={24} color="#000000" />
              <ThemedText style={styles.actionText}>Email</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          {/* About */}
          <ThemedView style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              About
            </ThemedText>
            <ThemedText style={styles.description}>{provider.description}</ThemedText>
          </ThemedView>

          {/* Address */}
          <ThemedView style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Address
            </ThemedText>
            <TouchableOpacity onPress={handleDirections}>
              <ThemedView style={styles.infoRow}>
                <IconSymbol name="location.fill" size={18} color="#000000" />
                <ThemedText style={styles.infoText}>{provider.address}</ThemedText>
              </ThemedView>
            </TouchableOpacity>
          </ThemedView>

          {/* Contact */}
          <ThemedView style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Contact
            </ThemedText>
            <TouchableOpacity onPress={handleCall}>
              <ThemedView style={styles.infoRow}>
                <IconSymbol name="phone.fill" size={18} color="#000000" />
                <ThemedText style={styles.infoText}>{provider.phone}</ThemedText>
              </ThemedView>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleEmail}>
              <ThemedView style={styles.infoRow}>
                <IconSymbol name="envelope.fill" size={18} color="#000000" />
                <ThemedText style={styles.infoText}>{provider.email}</ThemedText>
              </ThemedView>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleWebsite}>
              <ThemedView style={styles.infoRow}>
                <IconSymbol name="globe" size={18} color="#000000" />
                <ThemedText style={styles.infoText}>{provider.website}</ThemedText>
              </ThemedView>
            </TouchableOpacity>
          </ThemedView>

          {/* Hours */}
          <ThemedView style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Hours
            </ThemedText>
            <ThemedView style={styles.infoRow}>
              <IconSymbol name="clock.fill" size={18} color="#000000" />
              <ThemedText style={styles.infoText}>{provider.hours}</ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Services Offered */}
          <ThemedView style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Services Offered
            </ThemedText>
            {provider.services.map((service: string, index: number) => (
              <ThemedView key={index} style={styles.serviceItem}>
                <ThemedText style={styles.serviceBullet}>•</ThemedText>
                <ThemedText style={styles.serviceText}>{service}</ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        </ScrollView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginBottom: 10,
  },
  backText: {
    color: '#000000',
    fontSize: 18,
  },
  content: {
    flex: 1,
  },
  businessHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: 'transparent',
  },
  businessName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 6,
    marginRight: 8,
  },
  reviews: {
    fontSize: 14,
    color: '#666666',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  distance: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 6,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: 'transparent',
  },
  actionButton: {
    alignItems: 'center',
    padding: 10,
  },
  actionText: {
    fontSize: 12,
    color: '#000000',
    marginTop: 6,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  infoText: {
    fontSize: 15,
    color: '#000000',
    marginLeft: 12,
    flex: 1,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  serviceBullet: {
    fontSize: 16,
    color: '#000000',
    marginRight: 8,
  },
  serviceText: {
    fontSize: 15,
    color: '#333333',
    flex: 1,
  },
});
