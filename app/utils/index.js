import dayjs from 'dayjs';

export const getDay = time => dayjs(time).format('YYYY-MM-DD');

export const formatMessageTime = v => {
  const messageTime = dayjs(v);
  const now = dayjs();
  if (messageTime.year() !== now.year()) {
    return messageTime.format('YYYY- HH:mm');
  }
  if (messageTime.date() !== now.date()) {
    return messageTime.format('MM-DD HH:mm');
  }
  return dayjs(v).format('HH:mm');
};
