// src/components/emails/CreatorCampEmail.tsx
import {
  Section,
  Text,
  Button,
  Hr,
  Row,
  Column,
  Img,
} from '@react-email/components';
import { EmailLayout } from './EmailLayout';

interface CreatorCampEmailProps {
  userFirstName?: string;
}

export const CreatorCampEmail = ({
  userFirstName = 'there',
}: CreatorCampEmailProps) => {
  return (
    <EmailLayout previewText="Turn consistency into creator confidence">
      {/* Headline */}
      <Section className="mt-[32px] text-center">
        <Text className="text-gray-900 text-2xl font-semibold leading-8">
          Turn consistency into creator confidence
        </Text>

        <Text className="text-gray-700 mt-4 text-lg leading-7">
          Building an audience doesn’t happen overnight; it happens post by
          post.
        </Text>

        <Text className="text-gray-700 mt-4 text-lg leading-7">
          That’s why we’re hosting our sixth edition of Creator Camp: a 30-day
          challenge to help you find your rhythm, stay accountable, and build
          the consistency every creator needs to grow.
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
          Claim your spot →
        </Button>
      </Section>

      <Hr className="border border-solid border-[#eaeaea] my-[32px]" />

      {/* Benefits */}
      <Section>
        <Text className="text-gray-900 text-lg font-semibold mb-4">
          Join Creator Camp to get:
        </Text>

        <Text className="text-gray-700 text-lg leading-7">
          • <strong>Daily prompts</strong>: easy ideas surfaced in Buffer’s
          Template Library
        </Text>

        <Text className="text-gray-700 text-lg leading-7 mt-2">
          • <strong>Habit tracking</strong>: see your streaks and posting goals
          progress in real time
        </Text>

        <Text className="text-gray-700 text-lg leading-7 mt-2">
          • <strong>Community support</strong>: a friendly Discord space to
          share wins, ask for feedback, and stay motivated
        </Text>
      </Section>

      <Section className="mt-[24px]">
        <Text className="text-gray-700 text-lg leading-7">
          Camp begins <strong>Wednesday, October 15</strong>, and it’s
          completely <strong className="underline">free to join</strong>!
        </Text>

        <Text className="text-gray-700 text-lg leading-7 mt-2">
          Spots in the Discord cohort are limited to keep the group small and
          supportive.
        </Text>

        <Text className="text-gray-700 text-lg leading-7 mt-2">
          See you in Discord!
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
              <em>Brand & community manager</em>
            </Text>
          </Column>
        </Row>
      </Section>
    </EmailLayout>
  );
};

export default CreatorCampEmail;
