// src/components/emails/TenantInviteEmail.tsx
import { Section, Text, Button, Row, Column, Img } from '@react-email/components';
import { EmailLayout } from './EmailLayout';
import { buildQrCodeUrl } from './constants';

interface TenantInviteEmailProps {
  setupURL?: string;
  name?: string;
}

export const TenantInviteEmail = ({ 
  setupURL = "https://heidisystems.com/mieter/setup", 
  name = "Mieter" 
}: TenantInviteEmailProps) => {
  const qrCodeUrl = buildQrCodeUrl(setupURL, 150);

  return (
    <EmailLayout previewText="Zugang zu Ihrem Mieterportal" variant="light">
      <Section className="bg-white border border-solid border-[#E5E5E5] rounded-[24px] p-[40px] mt-[13px]">
        
        {/* Greeting */}
        <Text className="text-[#1A1A1A] text-[20px] font-semibold m-0 mb-[20px]">
          Hallo {name},
        </Text>
        
        {/* Introduction */}
        <Text className="text-[#404040] text-[16px] leading-[24px] m-0 mb-[24px]">
          Sie können ab sofort Ihr persönliches <strong>Mieterportal</strong> nutzen.
        </Text>

        {/* Features List */}
        <Text className="text-[#404040] text-[16px] leading-[24px] m-0 mb-[24px]">
          Dort finden Sie unter anderem:
        </Text>
        <Text className="text-[#404040] text-[16px] leading-[24px] m-0 mb-[8px] pl-[16px]">
          • Ihren Verbrauch
        </Text>
        <Text className="text-[#404040] text-[16px] leading-[24px] m-0 mb-[8px] pl-[16px]">
          • Abrechnungsinformationen
        </Text>
        <Text className="text-[#404040] text-[16px] leading-[24px] m-0 mb-[32px] pl-[16px]">
          • wichtige Dokumente
        </Text>

        {/* QR Code Section */}
        <Section className="text-center mb-[32px] border border-solid border-[#E5E5E5] rounded-[24px] p-[30px]">
          <Text className="text-[#1A1A1A] text-[16px] font-semibold mb-[16px]">
            Scannen Sie einfach den QR-Code:
          </Text>
          
          <Row>
            <Column align="center">
              <div className="inline-block bg-white p-[15px] rounded-[12px]">
                <Img
                  src={qrCodeUrl}
                  alt="Mieterportal QR Code"
                  width={150}
                  height={150}
                />
              </div>
            </Column>
          </Row>
        </Section>

        {/* Alternative Button */}
        <Text className="text-[#404040] text-[16px] leading-[24px] m-0 mb-[16px] text-center">
          Alternativ können Sie den Zugang auch über diesen Link öffnen:
        </Text>

        <Section className="text-center mb-[32px]">
          <Button
            href={setupURL}
            className="rounded-full bg-[#BDEAA4] text-[#2F6121] text-[16px] font-bold no-underline text-center px-[32px] py-[12px]"
          >
            Mieterzugang
          </Button>
        </Section>

        {/* Password Note */}
        <Text className="text-[#404040] text-[16px] leading-[24px] m-0 mb-[24px]">
          Falls Sie noch kein Passwort vergeben haben, folgen Sie bitte den Anweisungen auf der Setup-Seite.
        </Text>

        {/* Support Note */}
        <Text className="text-[#404040] text-[16px] leading-[24px] m-0 mb-[24px]">
          Bei Fragen helfen wir Ihnen gerne weiter.
        </Text>

        {/* Closing */}
        <Text className="text-[#404040] text-[16px] leading-[24px] mt-[24px] m-0">
          Freundliche Grüße,<br />
          <span className="underline">Ihr Heidi Systems Team</span>
        </Text>
      </Section>
    </EmailLayout>
  );
};

export default TenantInviteEmail;
