import {
  SubscriptionOrigin,
  SubscriptionPaymentProvider,
  SubscriptionStatus,
  SubscriptionType,
  TeamMemberAuthorization,
} from 'app/graphql/types';
import { useAppState } from 'app/overmind';
import { useWorkspaceAuthorization } from './useWorkspaceAuthorization';

export const useSubscription = () => {
  const { activeTeamInfo } = useAppState();
  const { isTeamSpace } = useWorkspaceAuthorization();

  /**
   * Subscription states
   */

  // There are different statuses for a subscription, but only ACTIVE and TRIALING
  // should be considered an active TeamPro subscription.
  // TODO: This might change based on how we use other statuses in the subscription (eg: PAUSED)
  const hasActiveSubscription =
    activeTeamInfo?.subscription?.status === SubscriptionStatus.Active ||
    activeTeamInfo?.subscription?.status === SubscriptionStatus.Trialing;

  const hasPastOrActiveSubscription = Boolean(
    activeTeamInfo?.subscription?.status
  );

  /**
   * Trial states
   */

  const hasActiveTeamTrial =
    isTeamSpace &&
    activeTeamInfo?.subscription?.type === SubscriptionType.TeamPro &&
    activeTeamInfo?.subscription?.status === SubscriptionStatus.Trialing;

  const isEligibleForTrial = isTeamSpace && !hasPastOrActiveSubscription;

  const numberOfSeats = isTeamSpace
    ? activeTeamInfo?.userAuthorizations?.filter(
        ({ authorization }) =>
          authorization === TeamMemberAuthorization.Admin ||
          authorization === TeamMemberAuthorization.Write
      ).length
    : 1; // Personal

  const isPatron = [
    SubscriptionOrigin.Legacy,
    SubscriptionOrigin.Patron,
  ].includes(activeTeamInfo?.subscription?.origin);
  const isPaddle =
    activeTeamInfo?.subscription?.paymentProvider ===
    SubscriptionPaymentProvider.Paddle;

  const isStripe =
    activeTeamInfo?.subscription?.paymentProvider ===
    SubscriptionPaymentProvider.Stripe;

  return {
    subscription: activeTeamInfo?.subscription,
    hasActiveSubscription,
    hasActiveTeamTrial,
    hasPastOrActiveSubscription,
    isEligibleForTrial,
    numberOfSeats,
    isPatron,
    isPaddle,
    isStripe,
  };
};
