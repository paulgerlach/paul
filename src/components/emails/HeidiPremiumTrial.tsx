// HeidiPremiumTrial.tsx
// src/components/emails/HeidiPremiumTrial.tsx
import {
  Section,
  Text,
  Button,
  Hr,
} from '@react-email/components';
import { EmailLayout } from './EmailLayout';
import { SharedQrLoginSection } from "./SharedQrLoginSection";

interface HeidiTenantPortalProps {
  userFirstName?: string;
  portalLink?: string;
}

export const HeidiPremiumTrial = ({ 
  userFirstName = 'Mieter/in',
  portalLink = 'https://heidisystems.com' 
}: HeidiTenantPortalProps) => {

  return (
    <EmailLayout previewText="Zugang zu Ihrem persönlichen Mieterportal">
      {/* Greeting & Intro */}
      <Section className='text-center'>
        <Text className="text-2xl font-bold mb-4" style={{ color: '#000' }}>
          Zugang zu Ihrem Mieterportal
        </Text>
      </Section>
      <Section className="mt-[32px]">
        <Text className="text-gray-900 text-lg leading-6">
          Hallo {userFirstName},
        </Text>
        <Text className="text-gray-900 mt-4 text-lg leading-6">
          Sie können ab sofort Ihr persönliches Mieterportal nutzen. Dort finden Sie unter anderem:
        </Text>
        <ul className="text-gray-900 text-lg leading-7">
          <li>Ihren Verbrauch</li>
          <li>Abrechnungsinformationen</li>
          <li>wichtige Dokumente</li>
        </ul>
      </Section>

      {/* QR Code & Direct Login Section */}
      <SharedQrLoginSection
        size={130}
        title="Scannen Sie einfach den QR-Code:"
        description="Für den direkten Zugriff über Ihr Smartphone."
        buttonText="Zum Mieterportal"
      />

      {/* Alternative Link Button */}
      <Section className="text-center mt-[16px] mb-[32px]">
        <Text className="text-gray-600 text-sm mb-4">
          Alternativ können Sie den Zugang auch über diesen Link öffnen:
        </Text>
        <Button
          href={portalLink}
          className="rounded-md text-[#ffffff] text-lg font-medium no-underline text-center px-6 py-4"
          style={{ backgroundColor: '#2F6121' }}
        >
          Mieterzugang
        </Button>
      </Section>

      <Hr className="border border-solid border-[#eaeaea] my-[32px]" />

      {/* Support Info */}
      <Section>
        <Text className="text-gray-900 text-md leading-6">
          Falls Sie noch kein Passwort vergeben haben, folgen Sie bitte den Anweisungen auf der Setup-Seite. 
          Bei Fragen helfen wir Ihnen gerne weiter.
        </Text>
        <Text className="text-gray-900 text-md leading-6 mt-8">
          Freundliche Grüße<br />
          <strong>Ihr Heidi Systems Team</strong>
        </Text>
      </Section>
    </EmailLayout>
  );
};

export default HeidiPremiumTrial;
