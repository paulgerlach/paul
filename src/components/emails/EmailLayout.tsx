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
  variant?: 'light' | 'dark'; // Variante für Footer-/Hintergrund-Flexibilität
}

export const EmailLayout = ({ previewText, children, variant = 'dark' }: EmailLayoutProps) => {
  const isLight = variant === 'light';
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className={`${isLight ? 'bg-[#F9F9F4]' : 'bg-white'} my-auto mx-auto font-sans`}>
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

            {/* Footer */}
            <Section
              style={{
                textAlign: 'center',
                marginTop: '40px',
                padding: '24px',
                backgroundColor: isLight ? 'transparent' : '#2D3F3E',
                borderRadius: '8px'
              }}
            >
              <Row style={{ marginBottom: '16px' }}>
                <Column align="center">
                  <div style={{ display: 'inline-flex', gap: '16px', justifyContent: 'center' }}>
                    <Link href="https://www.instagram.com/heidisystems/">
                      <Img src={`https://img.icons8.com/?size=100&id=32320&format=png&color=${isLight ? '000000' : 'FFFFFF'}`} width="20" height="20" />
                    </Link>
                    <Link href="https://x.com/Heidisystems">
                      <Img src={`https://img.icons8.com/?size=100&id=YfCbGWCWcuar&format=png&color=${isLight ? '000000' : 'FFFFFF'}`} width="20" height="20" />
                    </Link>
                    <Link href="https://www.youtube.com/channel/UCv0HIBEJGgD_vNRIkNg6--Q">
                      <Img src={`https://img.icons8.com/?size=100&id=62852&format=png&color=${isLight ? '000000' : 'FFFFFF'}`} width="20" height="20" />
                    </Link>
                    <Link href="https://www.linkedin.com/company/heidisystems/">
                      <Img src={`https://img.icons8.com/?size=100&id=98960&format=png&color=${isLight ? '000000' : 'FFFFFF'}`} width="20" height="20" />
                    </Link>
                  </div>
                </Column>
              </Row>

              <Text style={{ color: isLight ? '#525252' : '#E5E7EB', fontSize: '12px', lineHeight: '18px' }}>
                Versendet vom Team der Heidi Systems GmbH, Rungestraße 21, 10179 Berlin.
              </Text>

              <Text style={{ color: isLight ? '#525252' : '#E5E7EB', fontSize: '12px', lineHeight: '18px', marginTop: '8px' }}>
                Du erhältst diese E-Mail, weil du hilfreiche Tipps und Best Practices abonniert hast, um Heidi Systems optimal zu nutzen.
              </Text>

              <Row style={{ marginTop: '16px' }}>
                <Column align="center">
                  <Text style={{ fontSize: '12px' }}>
                    <Link
                      href="#"
                      style={{ color: isLight ? '#525252' : '#E5E7EB', textDecoration: 'underline' }}
                    >
                      Abonnements verwalten
                    </Link>
                    <span style={{ margin: '0 8px', color: isLight ? '#525252' : '#E5E7EB' }}>|</span>
                    <Link
                      href="#"
                      style={{ color: isLight ? '#525252' : '#E5E7EB', textDecoration: 'underline' }}
                    >
                      Abmelden
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
