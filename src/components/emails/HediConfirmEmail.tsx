// src/components/emails/HeidiConfirmEmail.tsx
import { Section, Text, Button, Link } from '@react-email/components';
import { EmailLayout } from './EmailLayout';

export const HeidiConfirmEmail = () => {
  return (
    <EmailLayout previewText="Confirm your email address" variant="light">
      <Section className="bg-white border border-solid border-[#E5E5E5] rounded-[24px] p-[40px] mt-[13px]">
        <Text className="text-[#1A1A1A] text-[20px] font-semibold m-0 mb-[20px]">
          Welcome!
        </Text>
        
        <Text className="text-[#404040] text-[16px] leading-[24px] m-0 mb-[32px]">
          You&apos;re receiving this message because you recently signed up for a Heidi account. 
          Click the button below to confirm your email address:
        </Text>

        <Section className="text-center mb-[32px]">
          <Button
            href="#"
            className="rounded-full bg-[#BDEAA4] text-[#2F6121] text-[16px] font-bold no-underline text-center px-[32px] py-[12px]"
          >
            Confirm your email
          </Button>
        </Section>

        <Text className="text-[#404040] text-[16px] leading-[24px] m-0 mb-[24px]">
          This step adds extra security to your account by verifying you own this email address, 
          and ensures you have access to all the features available within your plan.
        </Text>

        <Text className="text-[#404040] text-[16px] leading-[24px] m-0">
          If you have questions about why you&apos;re receiving this email, or if you&apos;re having 
          trouble verifying your email,{' '}
          <Link href="#" className="text-[#2F6121] underline font-semibold">
            we&apos;re here to help!
          </Link>
        </Text>

        <Text className="text-[#404040] text-[16px] leading-[24px] mt-[24px] m-0">
          Cheers,<br />
          <span className="underline">The Heidi Systems Team</span>
        </Text>
      </Section>
    </EmailLayout>
  );
};

export default HeidiConfirmEmail;