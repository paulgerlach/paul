// src/components/emails/EmailLayout.tsx
import {
  Body,
  Container,
  Section,
  Text,
  Hr,
  Html,
  Head,
  Preview,
  Tailwind,
  Row,
  Column,
  Link,
  Img,
} from '@react-email/components';

interface EmailLayoutProps {
  previewText: string;
  children: React.ReactNode;
}

export const EmailLayout = ({ previewText, children }: EmailLayoutProps) => {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans font-medium">
          <Container className="rounded my-[40px] mx-auto p-[20px] max-w-[656px]">
            {/* Header */}
            <Section className="mt-[32px]">
              <Img
    src="https://heidisystems.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffooter_logo.187aba8a.png&w=1920&q=75&dpl=dpl_neB6SDUKBMXWaQ6k7GXPgMrUYD9Q"
    alt="Heidi Systems"
    width="120"
    height="auto"
    style={{
      margin: '0 auto',
      maxWidth: '120px',
      width: '100%',
      height: 'auto',
    }}
  />
            </Section>

            {children}

            {/* <Hr className="border border-solid border-[#eaeaea] my-[32px]" /> */}

            {/* Footer */}
            <Section
  style={{
    backgroundColor: '#2D3F3E',
    padding: '24px',
    textAlign: 'center',
  }}
>
    <Row style={{ marginBottom: '16px' }}>
  <Column align="center" style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
    <Link href="https://www.instagram.com/heidisystems/" style={{ display: 'inline-block' }}>
      <Img
        src="https://img.icons8.com/?size=100&id=32320&format=png&color=FFFFFF"
        width="20"
        height="20"
        alt="Instagram"
      />
    </Link>

    <Link href="https://x.com/Heidisystems" style={{ display: 'inline-block' }}>
      <Img
        src="https://img.icons8.com/?size=100&id=YfCbGWCWcuar&format=png&color=FFFFFF"
        width="20"
        height="20"
        alt="Twitter"
      />
    </Link>

    <Link href="https://www.youtube.com/channel/UCv0HIBEJGgD_vNRIkNg6--Q" style={{ display: 'inline-block' }}>
      <Img
        src="https://img.icons8.com/?size=100&id=62852&format=png&color=FFFFFF"
        width="20"
        height="20"
        alt="YouTube"
      />
    </Link>

    <Link href="https://www.linkedin.com/company/heidisystems/" style={{ display: 'inline-block' }}>
      <Img
        src="https://img.icons8.com/?size=100&id=98960&format=png&color=FFFFFF"
        width="20"
        height="20"
        alt="LinkedIn"
      />
    </Link>
  </Column>
</Row>

  <Text style={{ color: '#E5E7EB', fontSize: '12px', lineHeight: '18px' }}>
    Sent by the team at Heidi Systems GmbH Rungestrasse 21 10179 Berlin.
  </Text>

  <Text
    style={{
      color: '#E5E7EB',
      fontSize: '12px',
      lineHeight: '18px',
      marginTop: '8px',
    }}
  >
    You're receiving this email because you're subscribed to useful
    tips and best practices for getting the most out of Heidi Systems.
  </Text>

  <Row style={{ marginTop: '16px' }}>
    <Column align="center">
      <Text style={{ fontSize: '12px', color: '#E5E7EB' }}>
        <Link href="#" style={{ color: '#E5E7EB', textDecoration: 'underline' }}>
          Manage subscriptions
        </Link>
        <span style={{ margin: '0 6px' }}>|</span>
        <Link href="#" style={{ color: '#E5E7EB', textDecoration: 'underline' }}>
          Unsubscribe
        </Link>
      </Text>
    </Column>
  </Row>
</Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
