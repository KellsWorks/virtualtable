import { format } from "date-fns";

export default function downloadString (data: string, filename: string = "data.csv"): void {
  const link: HTMLAnchorElement = document.createElement("a");
  link.setAttribute("href", "data:application/octet-stream," + encodeURI(data));
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
}

export function dateTimeFormat (value: Date) : string {
    return value ? format(value, 'dd-MM-yyyy HH:mm') : ''
}

export function dateFormat (value: Date): string {
  return value ? format(value, 'dd-MM-yyyy') : '';
}
