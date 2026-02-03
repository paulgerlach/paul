// src/components/emails/CreatorCampEmail.tsx
import {
  Section,
  Text,
  Button,
  Hr,
  Row,
  Column,
  Img,
  Link
} from '@react-email/components';
import { EmailLayout } from './EmailLayout';
import { SharedQrLoginSection } from "./SharedQrLoginSection";

interface CreatorCampEmailProps {
  userFirstName?: string;
}

export const CreatorCampEmail = ({
  userFirstName = 'there',
}: CreatorCampEmailProps) => {

  return (
    <EmailLayout previewText="Mach aus Beständigkeit Creator-Selbstvertrauen">
      {/* Headline */}
      <Section className="mt-[32px] text-center">
        <Text className="text-gray-900 text-2xl font-semibold leading-8">
          Mach aus Beständigkeit Creator-Selbstvertrauen
        </Text>

        <Text className="text-gray-700 mt-4 text-lg leading-7">
          Eine Community entsteht nicht über Nacht – sondern Beitrag für Beitrag.
        </Text>

        <Text className="text-gray-700 mt-4 text-lg leading-7">
          Genau deshalb veranstalten wir die sechste Ausgabe unseres Creator Camps:
          eine 30-tägige Challenge, die dir hilft, deinen Rhythmus zu finden,
          dranzubleiben und die Beständigkeit aufzubauen, die jede Creator-Journey braucht.
        </Text>
      </Section>

      {/* CTA */}
      <Section className="text-center mt-[32px]">
        <Button
          href="#"
          className="rounded-full text-lg font-medium no-underline px-8 py-4"
          style={{
            backgroundColor: '#BDEAA4',
            color: '#2F6121',
          }}
        >
          Sichere dir deinen Platz →
        </Button>
      </Section>

       {/* QR Code Login Section - Matching the creative camp theme */}

        <SharedQrLoginSection
          size={130}
          title="Schneller Zugriff nach der Bestätigung:"
          description="Nach der Bestätigung deiner E-Mail scanne diesen QR-Code für direkten Zugriff."
          buttonText="Zum Login-Formular"
        />
      

      <Hr className="border border-solid border-[#eaeaea] my-[32px]" />

      {/* Benefits */}
      <Section>
        <Text className="text-gray-900 text-lg font-semibold mb-4">
          Das erwartet dich im Creator Camp:
        </Text>

        <Text className="text-gray-700 text-lg leading-7">
          • <strong>Tägliche Impulse</strong>: einfache Ideen direkt aus Buffers
          Vorlagenbibliothek
        </Text>

        <Text className="text-gray-700 text-lg leading-7 mt-2">
          • <strong>Habit-Tracking</strong>: verfolge deine Streaks und Posting-Ziele
          in Echtzeit
        </Text>

        <Text className="text-gray-700 text-lg leading-7 mt-2">
          • <strong>Community-Support</strong>: ein freundlicher Discord-Space, um
          Erfolge zu teilen, Feedback zu bekommen und motiviert zu bleiben
        </Text>
      </Section>

      <Section className="mt-[24px]">
        <Text className="text-gray-700 text-lg leading-7">
          Das Camp startet am <strong>Mittwoch, den 15. Oktober</strong> – und die
          Teilnahme ist <strong className="underline">komplett kostenlos</strong>!
        </Text>

        <Text className="text-gray-700 text-lg leading-7 mt-2">
          Die Plätze in der Discord-Gruppe sind begrenzt, damit die Community klein
          und unterstützend bleibt.
        </Text>

        <Text className="text-gray-700 text-lg leading-7 mt-2">
          Wir sehen uns auf Discord!
        </Text>
      </Section>

      {/* Signature */}
      <Section className="mt-[32px]">
        <Row style={{ alignItems: 'center', gap: '12px' }}>
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

          <Column>
            <Text className="text-gray-900 text-lg font-medium">
              Serena G.
            </Text>
            <Text className="text-gray-600 text-sm">
              <em>Markenmanager</em>
            </Text>
          </Column>
        </Row>
      </Section>
    </EmailLayout>
  );
};

export default CreatorCampEmail;
