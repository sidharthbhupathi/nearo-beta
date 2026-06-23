/** Single source of truth for beta launch numbers and honest marketing copy. */

export const MERCHANTS_ONBOARDED = 0;
export const BETA_FOUNDING_SLOTS = 100;
export const BETA_CITY = "Bengaluru";

export const IS_PRODUCTION = import.meta.env.PROD;

export function foundingCohortLabel(): string {
  if (MERCHANTS_ONBOARDED === 0) {
    return `Founding beta — first ${BETA_FOUNDING_SLOTS} shops in ${BETA_CITY}`;
  }
  return `${MERCHANTS_ONBOARDED} founding merchant${MERCHANTS_ONBOARDED === 1 ? "" : "s"} in ${BETA_CITY}`;
}

export function heroTrustHeadline(): string {
  return MERCHANTS_ONBOARDED === 0 ? "Founding beta cohort" : `${MERCHANTS_ONBOARDED} shops live`;
}

export function heroTrustSubline(): string {
  return MERCHANTS_ONBOARDED === 0
    ? `Be among the first Kiranas in ${BETA_CITY}`
    : `Growing with verified local retailers in ${BETA_CITY}`;
}
