import { useCallback } from "react";

const useDate = () => {
  const localDateFormat = useCallback((strDate) => {
    const date = new Date(`${strDate.replace('T', ' ')} UTC`);
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.length < 2 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const day = date.getDate().toString().length < 2 ? `0${date.getDate()}` : date.getDate();
  
    const h = date.getHours().toString().length < 2 ? `0${date.getHours()}` : date.getHours();
    const m = date.getMinutes().toString().length < 2 ? `0${date.getMinutes()}` : date.getMinutes();
    const s = date.getSeconds().toString().length < 2 ? `0${date.getSeconds()}` : date.getSeconds();
  
    return {
      year: +year,
      month: +month,
      day: +day,
      h: +h,
      m: +m,
      s: +s,
      dateTime: `${year}-${month}-${day} ${h}:${m}:${s}`,
      date: `${year}-${month}-${day}`,
      time: `${h}:${m}:${s}`,
      yearMonth: `${year}-${month}`,
    }
  }, []);
  
  const dateFormat = useCallback((Date) => {
    const year = Date.getFullYear();
    const month = `${Date.getMonth() + 1}`.length < 2 ? `0${Date.getMonth() + 1}` : Date.getMonth() + 1;
    const day = Date.getDate().toString().length < 2 ? `0${Date.getDate()}` : Date.getDate();
  
    const h = Date.getHours().toString().length < 2 ? `0${Date.getHours()}` : Date.getHours();
    const m = Date.getMinutes().toString().length < 2 ? `0${Date.getMinutes()}` : Date.getMinutes();
    const s = Date.getSeconds().toString().length < 2 ? `0${Date.getSeconds()}` : Date.getSeconds();
  
    return {
      year: +year,
      month: +month,
      day: +day,
      h: +h,
      m: +m,
      s: +s,
      dateTime: `${year}-${month}-${day} ${h}:${m}:${s}`,
      date: `${year}-${month}-${day}`,
      time: `${h}:${m}:${s}`,
      yearMonth: `${year}-${month}`,
    }
  }, []);
  
  const currentDate = useCallback(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = `${today.getMonth() + 1}`.length < 2 ? `0${today.getMonth() + 1}` : today.getMonth() + 1;
    const day = today.getDate().toString().length < 2 ? `0${today.getDate()}` : today.getDate();
  
    const h = today.getHours().toString().length < 2 ? `0${today.getHours()}` : today.getHours();
    const m = today.getMinutes().toString().length < 2 ? `0${today.getMinutes()}` : today.getMinutes();
    const s = today.getSeconds().toString().length < 2 ? `0${today.getSeconds()}` : today.getSeconds();
  
    return {
      year: +year,
      month: +month,
      day: +day,
      h: +h,
      m: +m,
      s: +s,
      dateTime: `${year}-${month}-${day} ${h}:${m}:${s}`,
      date: `${year}-${month}-${day}`,
      time: `${h}:${m}:${s}`,
      yearMonth: `${year}-${month}`,
    }
  }, []);

  const serverCurrentTime = useCallback(async (host) => {
    let time = window.serverTime;
    const response = await fetch(`${host}/api/time.php`);
    if (response.ok) {
      const data = await response.json();
      time = data.time;
    }
    let serverTimeFormBack;
    if (time) {
      const serverHours = window.serverTime.split(':')[0];
      serverTimeFormBack = dateFormat(new Date(new Date().setHours(serverHours)));
    }
    const regionTime = dateFormat(new Date(new Date().toLocaleString('en-US', {timeZone: 'Europe/London'})));

    return serverTimeFormBack ?? regionTime;
  }, [dateFormat]);
  
  return {
    localDateFormat,
    dateFormat,
    currentDate,
    serverCurrentTime
  }
}

export default useDate;