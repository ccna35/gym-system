export const API_VERSIONS = {
  current: "v1",
  supported: ["v1"] as const,
  deprecated: [] as string[],
};

export const DEFAULT_API_VERSION = API_VERSIONS.current;

export function isSupportedVersion(v?: string): boolean {
  return v ? API_VERSIONS.supported.includes(v as any) : false;
}

export function isDeprecatedVersion(v?: string): boolean {
  return v ? API_VERSIONS.deprecated.includes(v) : false;
}
