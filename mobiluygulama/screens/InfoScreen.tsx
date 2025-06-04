import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function InfoScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Chat')}
        >
          <Ionicons name="arrow-back" size={24} color="#5E72E4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Uygulama Hakkında</Text>
        <View style={styles.placeholderButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: 'https://api.a0.dev/assets/image?text=Proje%20Planlama%20Asistanı&aspect=1:1&seed=123' }}
              style={styles.logo}
            />
          </View>
          <Text style={styles.title}>Proje Planlama Asistanı</Text>
          <Text style={styles.subtitle}>
            Yapay zeka destekli proje planlama çözümü
          </Text>
        </View>
        
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="information-circle" size={22} color="#5E72E4" />
            <Text style={styles.sectionTitle}>Uygulama Hakkında</Text>
          </View>
          <Text style={styles.paragraph}>
            Proje Planlama Asistanı, projelerinizin planlanması ve yönetiminde size yardımcı olmak için tasarlanmış yapay zeka destekli bir chatbot uygulamasıdır. Karmaşık projeleri daha kolay yönetebilmeniz için akıllı öneriler sunar.
          </Text>
        </View>
        
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="star" size={22} color="#5E72E4" />
            <Text style={styles.sectionTitle}>Özellikler</Text>
          </View>
          
          <View style={styles.featuresGrid}>
            <View style={styles.featureItem}>
              <View style={styles.featureIconContainer}>
                <Ionicons name="chatbubble-outline" size={22} color="#5E72E4" />
              </View>
              <Text style={styles.featureTitle}>Akıllı Asistan</Text>
              <Text style={styles.featureText}>Yapay zeka destekli proje planlama sohbeti</Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={styles.featureIconContainer}>
                <Ionicons name="calendar-outline" size={22} color="#5E72E4" />
              </View>
              <Text style={styles.featureTitle}>Zaman Planlama</Text>
              <Text style={styles.featureText}>Proje zaman çizelgesi oluşturma önerileri</Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={styles.featureIconContainer}>
                <Ionicons name="list-outline" size={22} color="#5E72E4" />
              </View>
              <Text style={styles.featureTitle}>Görev Yönetimi</Text>
              <Text style={styles.featureText}>Görev listeleri ve önceliklendirme yardımı</Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={styles.featureIconContainer}>
                <Ionicons name="people-outline" size={22} color="#5E72E4" />
              </View>
              <Text style={styles.featureTitle}>Ekip Yönetimi</Text>
              <Text style={styles.featureText}>Ekip yönetimi ve görev dağılımı önerileri</Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={styles.featureIconContainer}>
                <Ionicons name="analytics-outline" size={22} color="#5E72E4" />
              </View>
              <Text style={styles.featureTitle}>Risk Analizi</Text>
              <Text style={styles.featureText}>Proje risk analizi ve değerlendirme</Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={styles.featureIconContainer}>
                <Ionicons name="diamond-outline" size={22} color="#5E72E4" />
              </View>
              <Text style={styles.featureTitle}>Kaynak Planlama</Text>
              <Text style={styles.featureText}>Proje kaynaklarının optimum kullanımı</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="help-circle" size={22} color="#5E72E4" />
            <Text style={styles.sectionTitle}>Nasıl Kullanılır?</Text>
          </View>
          
          <View style={styles.howToUseContainer}>
            <View style={styles.howToUseStep}>
              <View style={styles.stepNumberContainer}>
                <Text style={styles.stepNumber}>1</Text>
              </View>
              <View style={styles.stepTextContainer}>
                <Text style={styles.stepTitle}>Soru Sorun</Text>
                <Text style={styles.stepText}>
                  Chat ekranına giderek projeniz hakkında sorular sorun.
                </Text>
              </View>
            </View>
            
            <View style={styles.stepDivider} />
            
            <View style={styles.howToUseStep}>
              <View style={styles.stepNumberContainer}>
                <Text style={styles.stepNumber}>2</Text>
              </View>
              <View style={styles.stepTextContainer}>
                <Text style={styles.stepTitle}>Bilgileri Paylaşın</Text>
                <Text style={styles.stepText}>
                  Projenizin kapsamı, zaman çizelgesi ve kaynak ihtiyaçları hakkında bilgi verin.
                </Text>
              </View>
            </View>
            
            <View style={styles.stepDivider} />
            
            <View style={styles.howToUseStep}>
              <View style={styles.stepNumberContainer}>
                <Text style={styles.stepNumber}>3</Text>
              </View>
              <View style={styles.stepTextContainer}>
                <Text style={styles.stepTitle}>Önerileri Alın</Text>
                <Text style={styles.stepText}>
                  Asistandan çeşitli proje yönetimi önerileri ve planlamaları alın.
                </Text>
              </View>
            </View>
            
            <View style={styles.stepDivider} />
            
            <View style={styles.howToUseStep}>
              <View style={styles.stepNumberContainer}>
                <Text style={styles.stepNumber}>4</Text>
              </View>
              <View style={styles.stepTextContainer}>
                <Text style={styles.stepTitle}>İlerlemeyi Takip Edin</Text>
                <Text style={styles.stepText}>
                  Konuşmalarınız otomatik olarak kaydedilir ve istediğiniz zaman devam edebilirsiniz.
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="mail-outline" size={22} color="#5E72E4" />
            <Text style={styles.sectionTitle}>İletişim</Text>
          </View>
          <Text style={styles.paragraph}>
            Geri bildirimleriniz ve sorularınız için:
          </Text>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => Linking.openURL('mailto:info@projeplanlamaasistani.com')}
          >
            <Ionicons name="mail" size={16} color="#5E72E4" />
            <Text style={styles.contactButtonText}>info@projeplanlamaasistani.com</Text>
          </TouchableOpacity>
          
          <View style={styles.socialLinks}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-twitter" size={22} color="#5E72E4" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-linkedin" size={22} color="#5E72E4" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-instagram" size={22} color="#5E72E4" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Sürüm 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');
const cardWidth = width - 32; // Full width minus padding
const featureWidth = (cardWidth - 16) / 2; // Two columns with spacing

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A5568',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 4,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderButton: {
    width: 36,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#5E72E4',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#2D3748',
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 8,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: '#2D3748',
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4A5568',
    marginBottom: 12,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: featureWidth,
    marginBottom: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(94, 114, 228, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 4,
  },
  featureText: {
    fontSize: 13,
    color: '#718096',
    textAlign: 'center',
  },
  howToUseContainer: {
    marginTop: 4,
  },
  howToUseStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  stepNumberContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#5E72E4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumber: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepTextContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  stepText: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 20,
  },
  stepDivider: {
    height: 20,
    width: 1,
    backgroundColor: '#E2E8F0',
    marginLeft: 14,
    marginBottom: 8,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDF2FF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  contactButtonText: {
    color: '#5E72E4',
    fontSize: 14,
    marginLeft: 8,
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  versionContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  versionText: {
    fontSize: 13,
    color: '#A0AEC0',
  },
});