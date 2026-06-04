export interface Product {
  id: string
  name: string
  description: string
  price: number
  currency: string
  category: string
  imageUrl: string
  badge?: string
}

// NimbusDesk is a fictional SaaS toolkit. The "products" are subscription plans
// and add-ons — purchasing one is the conversion we want GTM to report to
// Rebrandly.
export const products: Product[] = [
  {
    id: 'plan-starter',
    name: 'Starter Plan',
    description:
      'For individuals getting started. 1 workspace, 3 projects, 5 GB storage, and email support. Billed monthly, cancel anytime.',
    price: 19.0,
    currency: 'USD',
    category: 'Subscription',
    imageUrl: 'https://picsum.photos/id/180/400/400',
  },
  {
    id: 'plan-pro',
    name: 'Pro Plan',
    description:
      'For growing teams. Unlimited projects, 100 GB storage, advanced analytics, and priority support. The most popular choice.',
    price: 49.0,
    currency: 'USD',
    category: 'Subscription',
    imageUrl: 'https://picsum.photos/id/0/400/400',
    badge: 'Most Popular',
  },
  {
    id: 'plan-business',
    name: 'Business Plan',
    description:
      'For scaling organizations. SSO, audit logs, custom roles, 1 TB storage, and a dedicated success manager.',
    price: 129.0,
    currency: 'USD',
    category: 'Subscription',
    imageUrl: 'https://picsum.photos/id/2/400/400',
    badge: 'Best Value',
  },
  {
    id: 'addon-seats',
    name: 'Extra Seats (5-pack)',
    description:
      'Add five additional member seats to any plan. Seats are billed on the same cycle as your subscription.',
    price: 25.0,
    currency: 'USD',
    category: 'Add-on',
    imageUrl: 'https://picsum.photos/id/366/400/400',
  },
  {
    id: 'addon-storage',
    name: 'Storage Pack (500 GB)',
    description:
      'Top up your workspace with an extra 500 GB of file storage. Stackable across your team.',
    price: 15.0,
    currency: 'USD',
    category: 'Add-on',
    imageUrl: 'https://picsum.photos/id/48/400/400',
  },
  {
    id: 'addon-onboarding',
    name: 'Guided Onboarding',
    description:
      'A one-time, hands-on onboarding session with a product specialist to get your team productive on day one.',
    price: 199.0,
    currency: 'USD',
    category: 'Service',
    imageUrl: 'https://picsum.photos/id/20/400/400',
    badge: 'One-time',
  },
]
