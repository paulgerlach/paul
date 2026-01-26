// HeidiPremiumTrial.tsx
// src/components/emails/HeidiPremiumTrial.tsx
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
import { EmailLayout } from './EmailLayout';

interface HeidiPremiumTrialProps {
  userFirstName?: string;
}

export const HeidiPremiumTrial = ({ userFirstName = 'there' }: HeidiPremiumTrialProps) => {
  const loginUrl = "https://heidisystems.com";
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(loginUrl)}&format=png&color=2F6121&bgcolor=FFFFFF&margin=10`;
  return (
    <EmailLayout previewText="Schalte die Premium-Tools von Heidi Systems kostenlos frei!">
      {/* Greeting */}
      <Section className="mt-[32px]">
        <Text className="text-gray-900 text-lg leading-6">
          Hi {userFirstName},
        </Text>
        <Text className="text-gray-900 mt-4 text-lg leading-6">
          wir hoffen, dass dir Heidi Systems gefällt und du gut in deinem Social-Media-Workflow
          angekommen bist. Wenn du noch mehr herausholen möchtest, schalte unsere Premium-Tools
          mit einer kostenlosen Testphase frei!
        </Text>
      </Section>

      {/* CTA Button */}
      <Section className="text-center mt-[32px] mb-[32px]">
        <Button
          href="#"
          className="rounded-full text-[#ffffff] text-lg text-[#2F6121] font-medium no-underline text-center px-6 py-4"
          style={{ backgroundColor: '#BDEAA4' }}
        >
          Premium-Tools kostenlos testen
        </Button>
      </Section>

       <Section className="mt-[32px] mb-[32px] text-center border border-solid border-[#E5E5E5] rounded-[24px] p-[30px]">
        <Text className="text-gray-900 text-lg font-medium mb-[20px]">
          Schneller Login mit QR-Code
        </Text>
        <Row>
          <Column align="center">
            <div className="inline-block bg-white p-[15px] rounded-[12px] border border-solid border-[#E5E5E5]">
              <Img
                src={qrCodeUrl}
                alt="Heidi Systems Login QR Code"
                width="150"
                height="150"
                className="mx-auto"
              />
            </div>
            <Text className="text-gray-600 text-sm mt-[16px] mb-[20px]">
              Scanne den QR-Code mit deinem Smartphone<br />für direkten Login
            </Text>
            <Link
              href={loginUrl}
              className="text-[#2F6121] text-base font-medium underline"
            >
              Oder hier klicken zum Einloggen →
            </Link>
          </Column>
        </Row>
      </Section>

      <Hr className="border border-solid border-[#eaeaea] my-[32px] mx-0" />

      {/* Features Section */}
      <Section>
        <Text className="text-gray-900 text-lg font-medium">
          Zusätzlich zu <strong>unbegrenzt geplanten</strong> Beiträgen pro Kanal erhältst du mit
          unserer 14-tägigen kostenlosen Testphase Zugriff auf{' '}
          <strong className="underline text-[#2F6121]">Engagement</strong>- und{' '}
          <strong className="underline text-[#2F6121]">Analyse</strong>-Tools.
        </Text>
      </Section>

      {/* Feature 1 */}
      <Section className="mt-[32px]">
        <Row>
          <Column width="50%" className="pr-4">
            <Img
              src="https://heidisystems.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fnews3.dbb8aec9.png&w=1920&q=75&dpl=dpl_neB6SDUKBMXWaQ6k7GXPgMrUYD9Q"
              alt="Kommentare"
              className="object-contain"
              style={{
                maxHeight: '100%',
                maxWidth: '100%',
                height: 'auto',
                objectFit: 'contain',
              }}
            />
          </Column>
          <Column
            width="50%"
            style={{ display: 'flex', width: '100%', flexDirection: 'column', justifyContent: 'center' }}
          >
            <Text className="text-gray-900 text-xl font-medium">
              <strong>Direkt zu wichtigen Kommentaren springen</strong>
            </Text>
            <Text className="text-gray-900 mt-2 text-lg leading-6">
              Deine Instagram- und Facebook-Beiträge werden mit Labels für ungelesene oder negative
              Kommentare sowie Kommentare mit Fragen versehen.
            </Text>
          </Column>
        </Row>
      </Section>

      {/* Feature 2 */}
      <Section className="mt-[32px]">
        <Row>
          <Column
            width="50%"
            style={{ display: 'flex', width: '100%', flexDirection: 'column', justifyContent: 'center' }}
          >
            <Text className="text-gray-900 text-xl font-medium">
              <strong>Erhalte wertvolle Einblicke mit Analytics</strong>
            </Text>
            <Text className="text-gray-900 mt-2 text-lg leading-6">
              Eine zentrale, sortierbare Übersicht nach Reichweite und Engagement – inklusive
              personalisierter Empfehlungen für optimale Posting-Zeiten und -Frequenz.
            </Text>
          </Column>
          <Column width="50%" className="pr-4">
            <Img
              src="https://heidisystems.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fnews1.e6e07b67.png&w=1920&q=75&dpl=dpl_neB6SDUKBMXWaQ6k7GXPgMrUYD9Q"
              alt="Analytics"
              className="object-contain"
              style={{
                maxHeight: '100%',
                height: 'auto',
                maxWidth: '100%',
                objectFit: 'contain',
              }}
            />
          </Column>
        </Row>
      </Section>

      <Hr className="border border-solid border-[#eaeaea] my-[32px]" />

      {/* Signature */}
      <Section className="mt-[32px]">
        <Row style={{ alignItems: 'center', gap: '12px' }}>
          {/* Avatar */}
          <Column width="30%">
            <Img
              src="https://tse4.mm.bing.net/th/id/OIP.E5TZoUH1kdRUJ8UnouzAWgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
              alt="Serena G."
              style={{
                maxHeight: '100%',
                height: 'auto',
                maxWidth: '100%',
                objectFit: 'contain',
              }}
            />
          </Column>

          {/* Signature text */}
          <Column className="ml-8">
            <Text className="text-gray-900 text-lg font-medium mt-2">
              Serena G.
            </Text>
            <Text className="text-gray-600 text-sm mt-1">
              <em>Markenmanager</em>
            </Text>
          </Column>
        </Row>
      </Section>
    </EmailLayout>
  );
};

export default HeidiPremiumTrial;
