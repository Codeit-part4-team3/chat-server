import * as winston from 'winston';
import * as moment from 'moment-timezone';
import * as appRootPath from 'app-root-path';

export const appendTimestamp = winston.format((info, opts) => {
  if (opts.tz) {
    info.timestamp = moment().tz(opts.tz).format();
  }
  return info;
});

// 로그 저장 파일 옵션
export const dailyOptions = (level: string) => {
  return {
    level: 'info',
    datePattern: 'YYYY-MM-DD', // 날짜 포맷
    dirname: `${appRootPath.path}/logs` + `/${level}`, // 저장할 URL: 여기서는  루트에 logs라는 폴더가 생기고 그 아래에 level 폴더
    filename: `%DATE%.${level}.log`,
    maxFiles: 20, // 보관할 최대 로그 수
    zippedArchive: true, // 로그가 쌓였을 때 압축
    colorize: true, // 로그 메세지에 색상 추가
    handleExceptions: true, // 로거가 애플리케이션에서 발생하는 예외를 자동으로 감지해 기록
    json: false, // JSON 형식이 아닌 일반 텍스트 형식으로 출력

    format: winston.format.combine(
      appendTimestamp({ tz: 'Asia/Seoul' }),
      winston.format.printf((info) => {
        return `${info.timestamp} - ${info.level} - ${info.message}`;
      }),
    ),
  };
};
