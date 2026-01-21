import CreatorCampEmail from '@/components/emails/CreatorCampEmail';
import HeidiPremiumTrial from '@/components/emails/HeidiPremiumTrial';
import HeidiYearlyReview from '@/components/emails/HeidiYearlyReview';

export default function EmailPreviewPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8 space-y-12">
      <h1 className="text-2xl font-bold">Email Templates Preview</h1>

      <div className="bg-white rounded-lg shadow-lg p-4">
        <h2 className="font-semibold mb-4">Premium Trial</h2>
        <HeidiPremiumTrial userFirstName="Kgothatso" />
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4">
        <h2 className="font-semibold mb-4">Yearly Review</h2>
        <HeidiYearlyReview
          userFirstName="Kgothatso"
          topPlatform="Instagram"
          percentile={12}
        />
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4">
        <h2 className="font-semibold mb-4">Creator Camp</h2>
        <CreatorCampEmail userFirstName="Kgothatso" />
      </div>
    </div>
  );
}
