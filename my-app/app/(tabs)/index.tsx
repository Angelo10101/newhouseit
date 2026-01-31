import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeAreaView, Image, Platform, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState, useMemo } from 'react';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLocation } from '@/hooks/useLocation';
import { AIRecommendationChat } from '@/components/AIRecommendationChat';
import { Business } from '@/hooks/useBusinessRecommendation';



const services = [
  { id: 'electrician', name: 'Electrician', icon: 'bolt.fill', color: '#000000' },
  { id: 'plumbing', name: 'Plumbing', icon: 'wrench.fill', color: '#000000' },
  { id: 'roofing', name: 'Roofing', icon: 'house.fill', color: '#000000' },
  { id: 'painting', name: 'Painter', icon: 'paintbrush.fill', color: '#000000' },
  { id: 'mechanic', name: 'In-House Mechanic', icon: 'car.fill', color: '#000000' },
  { id: 'entertainment', name: 'Home Entertainment', icon: 'tv.fill', color: '#000000' },
  { id: 'interior', name: 'Interior Design', icon: 'sofa.fill', color: '#000000' },
];

// Service provider data for AI recommendations
const serviceProviders = {
  electrician: [
    { id: 1, name: 'Lightning Electric Co.', rating: 4.8, reviews: 142, description: 'Professional electrical services with over 20 years of experience. We specialize in residential and commercial electrical installations, repairs, and maintenance.' },
    { id: 2, name: 'PowerUp Services', rating: 4.6, reviews: 89, description: 'Quality electrical work at affordable prices. Fast response time and professional service guaranteed.' },
    { id: 3, name: 'Bright Spark Electric', rating: 4.9, reviews: 203, description: 'Award-winning electrical contractors serving Johannesburg and surrounding areas. We pride ourselves on excellent customer service.' },
  ],
  plumbing: [
    { id: 1, name: 'AquaFix Pro', rating: 4.7, reviews: 156, description: 'Expert plumbing services for all your needs. From leak repairs to complete bathroom installations.' },
    { id: 2, name: 'Pipeline Masters', rating: 4.5, reviews: 94, description: 'Reliable plumbing solutions with competitive pricing. No job too big or small.' },
    { id: 3, name: 'Flow Control Services', rating: 4.8, reviews: 178, description: 'Your trusted plumbing partner. We offer comprehensive plumbing services with a focus on quality and customer satisfaction.' },
  ],
  roofing: [
    { id: 1, name: 'TopShield Roofing', rating: 4.9, reviews: 234, description: 'Premium roofing services. From repairs to complete roof replacements, we do it all.' },
    { id: 2, name: 'SkyGuard Services', rating: 4.6, reviews: 112, description: 'Experienced roofing contractors with a focus on quality and durability. Satisfaction guaranteed.' },
    { id: 3, name: 'Apex Roofing Co.', rating: 4.7, reviews: 189, description: 'Top-quality roofing solutions for residential and commercial properties. Licensed and insured.' },
  ],
  painting: [
    { id: 1, name: 'ColorCraft Painters', rating: 4.8, reviews: 167, description: 'Professional painting services for residential and commercial properties. Quality finish guaranteed.' },
    { id: 2, name: 'Brush & Roll Pro', rating: 4.5, reviews: 98, description: 'Affordable painting services without compromising on quality. Free quotes and color matching.' },
    { id: 3, name: 'Perfect Finish Paint', rating: 4.9, reviews: 223, description: 'Award-winning painters with attention to detail. We transform your space with precision and care.' },
  ],
  mechanic: [
    { id: 1, name: 'Mobile Auto Care', rating: 4.7, reviews: 134, description: 'Mobile mechanic service that comes to you. Professional vehicle repairs and maintenance at your doorstep.' },
    { id: 2, name: 'DriveRight Services', rating: 4.6, reviews: 87, description: 'Comprehensive auto repair and maintenance services. All makes and models welcome.' },
    { id: 3, name: 'OnSite Auto Repair', rating: 4.8, reviews: 156, description: 'On-site vehicle repairs and servicing. We come to your home or office for convenient car care.' },
  ],
  entertainment: [
    { id: 1, name: 'TechSetup Pro', rating: 4.9, reviews: 198, description: 'Expert home entertainment installation and setup. Transform your home into a smart entertainment hub.' },
    { id: 2, name: 'MediaInstall Experts', rating: 4.7, reviews: 143, description: 'Professional audio-visual installation services. We specialize in creating immersive entertainment experiences.' },
    { id: 3, name: 'HomeTheater Plus', rating: 4.8, reviews: 176, description: 'Complete home theater solutions from design to installation. Experience cinema-quality at home.' },
  ],
  interior: [
    { id: 1, name: 'Design & Style Co.', rating: 4.9, reviews: 267, description: 'Transform your space with our expert interior design services. We bring your vision to life.' },
    { id: 2, name: 'Modern Spaces', rating: 4.6, reviews: 134, description: 'Contemporary interior design for modern living. We create functional and beautiful spaces.' },
    { id: 3, name: 'Elite Interiors', rating: 4.8, reviews: 201, description: 'Luxury interior design services for discerning clients. Elegant solutions tailored to your lifestyle.' },
  ],
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { location, error, loading } = useLocation();
  const [chatVisible, setChatVisible] = useState(false);

  useEffect(() => {
    if (location) {
      console.log('User location updated:', location);
    }
    if (error) {
      console.error('Location error:', error);
    }
  }, [location, error]);

  const navigateToService = (serviceId: string) => {
    router.push(`/service/${serviceId}`);
  };

  // Prepare businesses list for AI recommendations (memoized to avoid recalculation on every render)
  const allBusinesses = useMemo((): Business[] => {
    const businesses: Business[] = [];
    
    Object.entries(serviceProviders).forEach(([category, providers]) => {
      providers.forEach((provider) => {
        businesses.push({
          id: `${category}-${provider.id}`,
          name: provider.name,
          category: category.charAt(0).toUpperCase() + category.slice(1),
          description: provider.description,
        });
      });
    });
    
    return businesses;
  }, []); // Empty dependency array since serviceProviders is static

  return (
  <>
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FFFFFF', dark: '#000000' }}
      headerImage={
        <ThemedView
          style={[
            styles.headerContainer,
            {
              paddingTop: insets.top + 24,
              height: 120,
            },
          ]}
        >
          <Image
            source={require('@/assets/images/houseit-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <ThemedText style={styles.headerSubtitle}>Home Services at Your Fingertips</ThemedText>
        </ThemedView>
      }
    >
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>What service do you need?</ThemedText>

        <ScrollView style={styles.servicesContainer} showsVerticalScrollIndicator={false}>
          {services.map((service) => (
            <TouchableOpacity
              key={service.id}
              onPress={() => navigateToService(service.id)}
            >
              <ThemedView style={[styles.serviceCard, { borderLeftColor: service.color }]}>
                <ThemedView style={styles.serviceContent}>
                  <IconSymbol name={service.icon as any} size={24} color="#000000" style={styles.serviceIcon} />
                  <ThemedView style={styles.serviceInfo}>
                    <ThemedText type="defaultSemiBold" style={styles.serviceName}>
                      {service.name}
                    </ThemedText>
                    <ThemedText style={styles.serviceDescription}>
                      Professional {service.name.toLowerCase()} services
                    </ThemedText>
                  </ThemedView>
                  <ThemedText style={styles.arrow}>›</ThemedText>
                </ThemedView>
              </ThemedView>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ThemedView>
    </ParallaxScrollView>

    {/* AI Chatbot Floating Button */}
    <TouchableOpacity
      style={[styles.floatingButton, { bottom: 30 + insets.bottom }]}
      onPress={() => setChatVisible(true)}
    >
      <IconSymbol name="brain" size={28} color="#FFFFFF" />
    </TouchableOpacity>

    {/* AI Recommendation Chat Modal */}
    <AIRecommendationChat
      visible={chatVisible}
      onClose={() => setChatVisible(false)}
      businesses={allBusinesses}
    />
  </>
);
}

const styles = StyleSheet.create({
  headerContainer: {
    minHeight: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingBottom: 10,
  },
  logo: {
    width: 800,
    height: 130,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  servicesContainer: {
    flex: 1,
  },
  serviceCard: {
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  serviceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  serviceIcon: {
    marginRight: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    opacity: 0.6,
  },
  arrow: {
    fontSize: 24,
    opacity: 0.3,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#000000',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
