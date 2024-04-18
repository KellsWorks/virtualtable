import { format } from 'date-fns';

const isChildOfClass = (obj: any, className = "") => {
  while (
    obj !== undefined &&
    obj !== null &&
    obj.tagName.toUpperCase() !== "BODY"
  ) {
    if (obj.classList.contains(className)) return true;
    obj = obj.parentNode;
  }
  return false;
};
const euro = (value: number | string) =>{
    return typeof value === 'number' || typeof value === 'string' ? `&euro; ${parseFloat(value as string).toFixed(2)}` : value
}

const dateFormat = (value?: string | Date) => {
    return value ? format(new Date(value), 'dd-MM-yyyy') : '';
}

const dateTimeFormat = (value?: string | Date) => {
    return value ? format(new Date(value), 'dd-MM-yyyy HH:mm') : '';
}

const clone = (data: any) => {
    return (typeof data === 'undefined' ? undefined : JSON.parse(JSON.stringify(data)));
};
const dateFormatISO = (date: Date) => {
    return date ? format(date, "yyyy-MM-dd HH:mm") : null;
};


export {
    isChildOfClass,
    euro,
    dateFormat,
    dateTimeFormat,
    clone,
    dateFormatISO
}
