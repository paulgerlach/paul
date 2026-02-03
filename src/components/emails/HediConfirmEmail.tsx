// src/components/emails/HeidiConfirmEmail.tsx
import { Section, Text, Button, Link,  Column,
  Row, Img } from '@react-email/components';
import { EmailLayout } from './EmailLayout';
import { SharedQrLoginSection } from "./SharedQrLoginSection";


export const HeidiConfirmEmail = () => {
 return (
    <EmailLayout previewText="Confirm your email address" variant="light">
      <Section className="bg-white border border-solid border-[#E5E5E5] rounded-[24px] p-[40px] mt-[13px]">
  <Text className="text-[#1A1A1A] text-[20px] font-semibold m-0 mb-[20px]">
    Willkommen!
  </Text>
  
  <Text className="text-[#404040] text-[16px] leading-[24px] m-0 mb-[32px]">
    Du erhältst diese Nachricht, weil du dich kürzlich für ein Heidi-Konto registriert hast.
    Klicke auf die Schaltfläche unten, um deine E-Mail-Adresse zu bestätigen:
  </Text>

  <Section className="text-center mb-[32px]">
    <Button
      href="#"
      className="rounded-full bg-[#BDEAA4] text-[#2F6121] text-[16px] font-bold no-underline text-center px-[32px] py-[12px]"
    >
      E-Mail-Adresse bestätigen
    </Button>
  </Section>

  <Section className="mt-[32px] mb-[24px] pt-[24px] border-t border-solid border-[#E5E5E5]">
          <Text className="text-[#1A1A1A] text-[16px] font-semibold mb-[16px]">
            Schneller Zugriff nach der Bestätigung:
          </Text>
          
          <SharedQrLoginSection
  size={130}
  title="Schneller Zugriff nach der Bestätigung:"
  description="Nach der Bestätigung deiner E-Mail scanne diesen QR-Code für direkten Zugriff."
  buttonText="Zum Login-Formular"
/>
        </Section>

  <Text className="text-[#404040] text-[16px] leading-[24px] m-0 mb-[24px]">
    Dieser Schritt erhöht die Sicherheit deines Kontos, indem bestätigt wird, dass dir diese
    E-Mail-Adresse gehört, und stellt sicher, dass du Zugriff auf alle Funktionen deines Tarifs hast.
  </Text>

  <Text className="text-[#404040] text-[16px] leading-[24px] m-0">
    Wenn du Fragen dazu hast, warum du diese E-Mail erhältst, oder Probleme bei der Bestätigung
    deiner E-Mail-Adresse hast,{' '}
    <Link href="#" className="text-[#2F6121] underline font-semibold">
      sind wir gerne für dich da!
    </Link>
  </Text>

  <Text className="text-[#404040] text-[16px] leading-[24px] mt-[24px] m-0">
    Viele Grüße,<br />
    <span className="underline">Das Heidi Systems Team</span>
  </Text>
</Section>

    </EmailLayout>
  );
};

export default HeidiConfirmEmail;