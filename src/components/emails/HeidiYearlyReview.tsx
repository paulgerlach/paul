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
  const previewText = `Dein Heidi Systems Jahresrückblick 2025 ist da!`;

  return (
    <EmailLayout previewText={previewText}>
      {/* Header Section */}
      <Section className="text-center mt-[32px]">
        <Text className="text-3xl font-bold mb-4" style={{ color: '#000' }}>
          Die Ergebnisse sind da …
        </Text>
      </Section>

      <Section
        className="text-center rounded-4xl mt-[10px]"
        style={{
          backgroundColor: '#193333',
          color: '#fff',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <Row>
          <Column width="60%" className="text-left">
            <div className="my-8">
              <Text className="text-2xl mb-2" style={{ color: '#fff' }}>
                Wir sind da
              </Text>
              <Text className="text-6xl font-bold" style={{ color: '#fff' }}>
                Für dich
              </Text>
            </div>
          </Column>
          <Column width="40%" className="text-right">
            <Img
              src="https://img.icons8.com/ios-glyphs/120/FFFFFF/activity-feed-2.png"
              alt="Aktivität"
              className="object-contain"
              style={{
                maxHeight: '100%',
                height: 'auto',
                maxWidth: '100%',
                objectFit: 'contain',
                transform: 'rotate(90deg)',
                width: '100%',
              }}
            />
          </Column>
        </Row>
      </Section>

      <Hr className="border border-solid border-[#eaeaea] my-[32px] mx-0" />

      {/* Introduction Section */}
      <Section className="mt-[32px]">
        <Text className="text-gray-900 text-lg leading-6">
          In diesem Jahr hast du deine Ideen wachsen lassen und neue Zielgruppen über{' '}
          <strong>{socialAccountCount} Social-Media-Kanäle</strong> erreicht – und dir damit den Titel
          „Löwenzahn“ verdient.
        </Text>

        <Text className="text-gray-900 mt-4 text-lg leading-6">
          Deine aktivste Plattform war {topPlatform}. Damit gehörst du zu den besten{' '}
          {percentile}% der Buffer-Creator:innen, die dort dieses Jahr gepostet haben
          <br />
          <br />— deine Ideen heben richtig ab.
        </Text>
      </Section>

      {/* CTA Button */}
      <Section className="text-center mt-[32px] mb-[32px]">
        <Button
          href="#"
          className="rounded-full text-[#ffffff] text-lg text-[#2F6121] font-medium no-underline text-center px-6 py-4"
          style={{ backgroundColor: '#BDEAA4' }}
        >
          Deine Statistiken ansehen
        </Button>
      </Section>

      <Hr className="border border-solid border-[#eaeaea] my-[32px] mx-0" />

      {/* Top Performing Post Section */}
      <Section className="mt-[32px] text-center">
        <Text className="text-2xl font-bold text-gray-900 mb-6">
          Dein erfolgreichster Beitrag 2025
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
            alt="Beitragsbild"
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
          Dein Social-Garten ist dieses Jahr multichannel gewachsen – aber dieser Beitrag auf{' '}
          {topPlatform} hat die tiefsten Wurzeln geschlagen.
        </Text>
        <Link
          href="#"
          className="block mb-10 text-center w-fit mx-auto text-green text-base leading-[19.2px]"
          style={{ color: '#2F6121' }}
        >
          Daraus einen neuen Beitrag erstellen →
        </Link>
      </Section>

      <Hr className="border border-solid border-[#eaeaea] my-[32px] mx-0" />

      {/* Share Section */}
      <Section className="mt-[32px] text-center">
        <Text className="text-gray-900 text-lg leading-6 mb-6">
          Dein Social-Garten ist dieses Jahr multichannel gewachsen – zeig anderen, wie stark dein
          Wachstum war.
        </Text>

        <Button
          href="#"
          className="rounded-full text-[#ffffff] text-lg text-[#2F6121] font-medium no-underline text-center px-6 py-4"
          style={{ backgroundColor: '#BDEAA4' }}
        >
          Dein Wachstum teilen
        </Button>
      </Section>
    </EmailLayout>
  );
};

export default HeidiYearlyReview;
