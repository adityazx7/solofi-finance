import { z } from 'zod';

export const waitlistFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['freelancer', 'solopreneur', 'micro_business', 'startup_founder'], {
    required_error: 'Please select your role',
  }),
  monthlyIncomeBand: z.string().min(1, 'Please select your average monthly income'),
  biggestTaxWorry: z.string().max(280, 'Must be under 280 characters').optional(),
  referredByCode: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
});

export type WaitlistFormInput = z.infer<typeof waitlistFormSchema>;

export interface WaitlistSubmissionResult {
  success: boolean;
  queuePosition: number;
  referralCode: string;
  referralLink: string;
  totalWaitlistCount: number;
  message: string;
}
