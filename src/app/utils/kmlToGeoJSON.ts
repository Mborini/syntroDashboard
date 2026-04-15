import * as toGeoJSON from "@tmcw/togeojson";
import { DOMParser } from "xmldom";

export async function convertKmlFileToGeoJSON(file: File) {
  const text = await file.text();

  const parser = new DOMParser();
  const kml = parser.parseFromString(text, "text/xml");

  const geojson = toGeoJSON.kml(kml);

  return geojson;
}