// HeidiPremiumTrial.tsx
// src/components/emails/HeidiPremiumTria.tsx
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
  // const previewText = `Unlock Heidi Systems Premium Tools for Free!`;

  return (
    <EmailLayout previewText="Unlock Heidi Systems Premium Tools for Free!">
      {/* Greeting */}
            <Section className="mt-[32px]">
              <Text className="text-gray-900 text-lg leading-6">
                Hi {userFirstName},
              </Text>
              <Text className="text-gray-900 mt-4 text-lg leading-6">
                We hope you&apos;ve been enjoying Heidi Systems and are in your social media management groove. 
                If you&apos;re looking for even more, unlock our premium tools free with trial!
              </Text>
            </Section>

            {/* CTA Button */}
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                href="#"
                className="rounded-full text-[#ffffff] text-lg text-[#2F6121] font-medium no-underline text-center px-6 py-4"
                style={{ backgroundColor: '#BDEAA4' }}
              >
                Try premium tools for free
              </Button>
            </Section>

            <Hr className="border border-solid border-[#eaeaea] my-[32px] mx-0" />

            {/* Features Section */}
            <Section>
              <Text className="text-gray-900 text-lg font-medium">
                In addition to <strong>unlimited scheduled</strong> posts per channel, our 14-day free trial gives you access to <strong className='underline text-[#2F6121]'>engagement</strong> and <strong className='underline text-[#2F6121]'>analytics</strong> tools.
              </Text>
            </Section>

            {/* Feature 1 */}
            <Section className="mt-[32px]">
        <Row>
          <Column width="50%" className="pr-4">
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
          <Column width="50%" style={{ display: 'flex', width:'100%', flexDirection: 'column', justifyContent: 'center' }}>
            <Text className="text-gray-900 text-xl font-medium">
              <strong>Jump to important comments</strong>
            </Text>
            <Text className="text-gray-900 mt-2 text-lg leading-6">
              Your Instagram and Facebook posts have labels for unread or negative comments, 
              or comments with a question.
            </Text>
          </Column>
        </Row>
      </Section>

            {/* Feature 2 */}
            <Section className="mt-[32px]">
              <Row>
                <Column width="50%" style={{ display: 'flex', width:'100%', flexDirection: 'column', justifyContent: 'center' }}>
              <Text className="text-gray-900 text-xl font-medium">
                <strong>
                  Unlock insights with Analytics
                </strong>
              </Text>
              <Text className="text-gray-900 mt-2 text-lg leading-6">
                An all-in-one, sortable view by reach and engagement with personalized 
                recommendations for posting times and frequency.
              </Text>
              </Column>
              <Column width="50%" className="pr-4">
            <Img
              src="https://heidisystems.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fnews1.e6e07b67.png&w=1920&q=75&dpl=dpl_neB6SDUKBMXWaQ6k7GXPgMrUYD9Q" 
              alt="Important Comments Icon"
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
    <Column className='ml-8'>
      <Text className="text-gray-900 text-lg font-medium mt-2">
        Serena G.
      </Text>
      <Text className="text-gray-600 text-sm mt-1">
        <em>Brand & community manager</em>
      </Text>
    </Column>
  </Row>
</Section>

    </EmailLayout>
  )
};

export default HeidiPremiumTrial;