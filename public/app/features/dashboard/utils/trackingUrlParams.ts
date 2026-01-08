// NOTE: Keep this file free of DashboardLibrary imports; this helper is intentionally lightweight.
function sanitizeDatasourceTypes(raw: unknown): string[] | undefined {
  if (Array.isArray(raw)) {
    const cleaned = raw.filter((value): value is string => typeof value === 'string').map((value) => value.trim()).filter(Boolean);
    return cleaned.length > 0 ? cleaned : undefined;
  }

  if (typeof raw === 'string') {
    const cleaned = raw
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
    return cleaned.length > 0 ? cleaned : undefined;
  }

  return undefined;
}

export function extractDatasourceTypesFromUrl(search: string = window.location.search): string[] | undefined {
  const params = new URLSearchParams(search);
  const raw =
    params.get('datasourceTypes') ??
    params.get('datasourceType') ??
    params.get('dsTypes') ??
    params.get('dsType') ??
    params.get('pluginId') ??
    undefined;

  if (!raw) {
    return undefined;
  }

  if (raw.trim().startsWith('[')) {
    try {
      return sanitizeDatasourceTypes(JSON.parse(raw));
    } catch {
      console.warn('Invalid datasourceTypes URL parameter.');
      return undefined;
    }
  }

  return sanitizeDatasourceTypes(raw);
}
