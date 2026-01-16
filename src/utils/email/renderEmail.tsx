// renderEmail.tsx
// src/utils/email/renderEmail.tsx
// import { render } from '@react-email/render';
// import { HeidiPremiumTrial } from '@/components/emails/HeidiPremiumTrial';
// import { HeidiYearlyReview } from '@/components/emails/HeidiYearlyReview';

// export const renderHeidiPremiumTrialEmail = async (props = {}) => {
//   return render(<HeidiPremiumTrial {...props} />);
// };

// export const renderHeidiYearlyReviewEmail = async (props = {}) => {
//   return render(<HeidiYearlyReview {...props} />);
// };

// // For plain text version (optional)
// export const renderHeidiPremiumTrialText = async (props = {}) => {
//   return render(<HeidiPremiumTrial {...props} />, { plainText: true });
// };

// export const renderHeidiYearlyReviewText = async (props = {}) => {
//   return render(<HeidiYearlyReview {...props} />, { plainText: true });
// };

import { render } from '@react-email/render';
import HeidiPremiumTrial from '@/components/emails/HeidiPremiumTrial';
import HeidiYearlyReview from '@/components/emails/HeidiYearlyReview';
import CreatorCampEmail from '@/components/emails/CreatorCampEmail';

const templates = {
  premiumTrial: HeidiPremiumTrial,
  yearlyReview: HeidiYearlyReview,
   creatorCamp: CreatorCampEmail,
};

export type EmailTemplateKey = keyof typeof templates;

export const renderEmailByTemplate = async (
  template: EmailTemplateKey,
  props = {}
) => {
  const Template = templates[template];
  return render(<Template {...props} />);
};

export const renderEmailTextByTemplate = async (
  template: EmailTemplateKey,
  props = {}
) => {
  const Template = templates[template];
  return render(<Template {...props} />, { plainText: true });
};
