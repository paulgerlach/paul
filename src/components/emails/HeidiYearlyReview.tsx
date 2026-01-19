// src/components/emails/HeidiYearlyReview.tsx
import {
  Body,
  Container,
  Column,
  Row,
  Section,
  Text,
  Button,
  Img,
  Hr,
  Link,
  Head,
  Html,
  Preview,
  Tailwind,
} from '@react-email/components';
import vector from "@/asset/Vector.svg";
import { EmailLayout } from './EmailLayout';


interface HeidiYearlyReviewProps {
  userFirstName?: string;
  socialAccountCount?: number;
  topPlatform?: string;
  percentile?: number;
  topPostContent?: string;
  topPostUsername?: string;
  topPostImageUrl?: string;
}

export const HeidiYearlyReview = ({
  userFirstName = 'there',
  socialAccountCount = 4,
  topPlatform = 'Instagram',
  percentile = 12,
  topPostContent = 'Welche Software ist 2025 die beste für WEG-Hausverwaltungen? 🏢⚖️ Mit Rechtssicher nach WEG, GoBD & DSGVO 📄 Mit digitalem Eigentümerportal & ...',
  topPostUsername = 'heidisystems',
}: HeidiYearlyReviewProps) => {
  const previewText = `Your 2025 Heidi Systems Year in Review is here!`;

  return (
     <EmailLayout previewText={previewText}>
        {/* Header Section */}
        <Section className='text-center mt-[32px]'> 
            <Text className="text-3xl font-bold  mb-4" style={{ color: '#000' }}>
                The results are in...
              </Text></Section>
            <Section className="text-center rounded-4xl mt-[10px]" style={{
                backgroundColor: '#193333',
                color: '#fff',
                padding: '24px',
                textAlign: 'center',
            }}>
              
              <Row>
                <Column width="60%" className='text-left'>
                <div className="my-8">
                <Text className="text-2xl  mb-2" style={{ color: '#fff' }}>We&apos;re here</Text>
                <Text className="text-6xl font-bold " style={{ color: '#fff' }}>For you</Text>
              </div>
                </Column>
                <Column width="40%" className='text-right'>
                <Img
              src="https://img.icons8.com/ios-glyphs/120/FFFFFF/activity-feed-2.png" 
              alt="Important Comments Icon"
              className="object-contain"
              style={{
                    maxHeight: '100%', 
                    height: 'auto',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    transform: 'rotate(90deg)',
                    width: '100%'
                }}
            />
                </Column>
              </Row>
            </Section>

            <Hr className="border border-solid border-[#eaeaea] my-[32px] mx-0" />

            {/* Introduction Section */}
            <Section className="mt-[32px]">
              <Text className="text-gray-900 text-lg leading-6">
                You let your ideas take flight this year, reaching new audiences across{' '}
                <strong>{socialAccountCount} social accounts</strong> to earn the title of Dandelion.
              </Text>
              
              <Text className="text-gray-900 mt-4 text-lg leading-6">
                Your most engaged platform was {topPlatform}, placing you in the top{' '}
                {percentile}% of Buffer creators posting there this year <br /><br />— your ideas are taking off.
              </Text>
            </Section>

            {/* CTA Button */}
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                href="#"
                className="rounded-full text-[#ffffff] text-lg text-[#2F6121] font-medium no-underline text-center px-6 py-4"
                style={{ backgroundColor: '#BDEAA4' }}
              >
                See your stats
              </Button>
            </Section>

            <Hr className="border border-solid border-[#eaeaea] my-[32px] mx-0" />

            {/* Top Performing Post Section */}
            <Section className="mt-[32px] text-center">
              <Text className="text-2xl font-bold text-gray-900 mb-6">
                Your top-performing post of 2025
              </Text>
            </Section>

            <Hr className="border border-solid border-[#eaeaea] my-[32px] mx-0" />

            <Section>
                
                {/* Username */}
                <Column width="70%">
                <Text className="font-bold text-gray-900 text-lg mb-3">
                  {topPostUsername}
                </Text>
                
                {/* Post Content */}
                <Text className="text-gray-900 text-lg leading-8 mb-4">
                  {topPostContent}
                </Text>
                </Column>
                
                <Column width="30%">
                
                <Img
                src="https://heidisystems.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fnews3.dbb8aec9.png&w=1920&q=75&dpl=dpl_neB6SDUKBMXWaQ6k7GXPgMrUYD9Q" 
                alt="Comments Icon"
                className="object-contain"
                style={{
                    maxHeight: '100%', 
                    maxWidth: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                }}
                />
                </Column>
             
            </Section>

            <Hr className="border border-solid border-[#eaeaea] my-[32px] mx-0" />

            <Section className="mt-[32px] text-center">
              <Text className="text-gray-900 text-lg leading-6 mb-6">
                Your social garden went multi-channel this year, but this {topPlatform} post&apos;s roots grew the deepest.
              </Text>
              <Link
                href='#'
                className="block mb-10 text-center w-fit mx-auto text-green text-base leading-[19.2px]"
                style={{ color: '#2F6121' }}
                >
                Turn this into a fresh post &rarr;
                </Link>
            </Section>

            <Hr className="border border-solid border-[#eaeaea] my-[32px] mx-0" />


            {/* Share Section */}
            <Section className="mt-[32px] text-center">
              <Text className="text-gray-900 text-lg leading-6 mb-6">
                Your social garden went multi-channel this year, but this {topPlatform} post&apos;s roots grew the deepest.
              </Text>
              
              <Button
                href="#"
                className="rounded-full text-[#ffffff] text-lg text-[#2F6121] font-medium no-underline text-center px-6 py-4"
                style={{ backgroundColor: '#BDEAA4' }}
              >
                Share your growth
              </Button>
            </Section>
     </EmailLayout>
  );
};

export default HeidiYearlyReview;