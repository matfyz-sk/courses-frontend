export const BASE_PREFIX =
  process.env.REACT_APP_BASE_PREFIX ??
  "http://www.courses.matfyz.sk/";

export const ONTOLOGY_PREFIX =
  process.env.REACT_APP_ONTOLOGY_PREFIX ??
  BASE_PREFIX + "ontology#";

export const DATA_PREFIX =
  process.env.REACT_APP_DATA_PREFIX ??
  BASE_PREFIX + "data/";
