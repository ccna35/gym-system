import { t } from "../i18n";

export const getMembershipStatusLabel = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return t.memberships.active;
    case "EXPIRING_SOON":
      return t.memberships.expiringSoon;
    case "EXPIRED":
      return t.memberships.expired;
    case "SUSPENDED":
      return t.memberships.suspended;
    default:
      return status;
  }
};
